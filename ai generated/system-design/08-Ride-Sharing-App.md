# 🚗 System Design #08 — Ride Sharing App
> **Like**: Uber, Ola, Lyft, Rapido  
> **Difficulty**: ⭐⭐⭐⭐ | **Teaches**: Geospatial, Real-time Matching, Surge Pricing

---

## 📋 Requirements

### Functional Requirements
- Rider: Book a ride from A to B
- Driver: Go online/offline, accept/reject rides
- Real-time driver location tracking
- Match rider to nearest available driver
- Fare estimation before booking
- Trip tracking (live map)
- Rating system
- Surge pricing (demand-based)
- Payment at end of trip

### Non-Functional Requirements
- **Users**: 5 million drivers, 50 million riders active
- **Peak Traffic**: 1 million concurrent live trips (peak hour)
- **Location Updates**: Drivers send location every 5 sec → 1M × 12 = **12M updates/min**
- **Availability**: 99.99% — "no rides" = lost business
- **Latency**: Match in < 2 seconds, ETA update < 1 second
- **Budget**: High
- **Tech**: Node.js, GoLang, Redis (with Geo), Kafka, PostgreSQL, WebSocket, Google Maps API

---

## 1. 🏛️ High-Level Architecture

```
[Rider App]         [Driver App]
     │                   │
     │  WebSocket         │  WebSocket (location heartbeat)
     ▼                   ▼
[API Gateway + Load Balancer]
     │
 ┌───┴────────────────────────────────────────────┐
 │                      Services                  │
 ├──► [Booking Service]          PostgreSQL       │
 ├──► [Matching Service]         Redis Geo        │
 ├──► [Location Service]         Redis Geo        │
 ├──► [ETA Service]              Maps API cache   │
 ├──► [Pricing Service]          Pricing model    │
 ├──► [Trip Service]             PostgreSQL       │
 ├──► [Notification Service]     Kafka + FCM      │
 └──► [Payment Service]          PostgreSQL       │
      │                                           │
      └───── [Kafka Event Bus] ──────────────────-┘
```

---

## 2. 🗄️ Database Design

### Trips Table (PostgreSQL — source of truth)
```sql
CREATE TABLE trips (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id            UUID NOT NULL,
    driver_id           UUID,
    
    -- Location data
    pickup_lat          DECIMAL(9,6) NOT NULL,
    pickup_lng          DECIMAL(9,6) NOT NULL,
    pickup_address      TEXT,
    dropoff_lat         DECIMAL(9,6) NOT NULL,
    dropoff_lng         DECIMAL(9,6) NOT NULL,
    dropoff_address     TEXT,
    
    -- Status flow
    status              VARCHAR(20) NOT NULL,
    -- 'searching' -> 'accepted' -> 'driver_arrived' -> 'trip_started' -> 'completed'|'cancelled'
    
    -- Financials
    estimated_fare      DECIMAL(10,2),
    actual_fare         DECIMAL(10,2),
    surge_multiplier    DECIMAL(3,2) DEFAULT 1.00,
    distance_km         DECIMAL(8,2),
    
    -- Timing
    requested_at        TIMESTAMPTZ DEFAULT NOW(),
    accepted_at         TIMESTAMPTZ,
    pickup_at           TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    
    -- Ratings
    rider_rating        SMALLINT,   -- 1-5
    driver_rating       SMALLINT    -- 1-5
);

CREATE INDEX idx_trips_rider ON trips(rider_id, requested_at DESC);
CREATE INDEX idx_trips_driver ON trips(driver_id, requested_at DESC);
CREATE INDEX idx_trips_status ON trips(status) WHERE status IN ('searching', 'accepted');
```

### Drivers Table
```sql
CREATE TABLE drivers (
    id              UUID PRIMARY KEY,
    user_id         UUID UNIQUE NOT NULL,
    license_no      VARCHAR(50) UNIQUE,
    vehicle_type    VARCHAR(20),    -- 'auto'|'sedan'|'suv'|'bike'
    vehicle_no      VARCHAR(20),
    avg_rating      DECIMAL(3,2) DEFAULT 5.0,
    total_trips     INTEGER DEFAULT 0,
    is_approved     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. 📍 Real-Time Location — The Core System

### Redis GEO — Storing Driver Locations
```
Redis command: GEOADD
Stores latitude/longitude with member name

Command: GEOADD drivers:online <lng> <lat> <driver_id>
         GEOADD drivers:online 77.5946 12.9716 "driver_abc"

Find all drivers within 2 km of a point:
  GEOSEARCH drivers:online FROMLONLAT 77.5946 12.9716
            BYRADIUS 2 km ASC COUNT 10

This command returns: [driver_abc (0.3km), driver_xyz (1.2km), ...]
O(N+log M) — very fast even with millions of drivers

Driver Availability:
  Set: "drivers:online:sedan" for vehicle type filtering
  GEOADD drivers:online:sedan <lng> <lat> <driver_id>

How Redis encodes geo:
  Uses 52-bit Geohash internally stored in Sorted Set
  Gives ~0.6mm precision — more than enough!
```

### Location Update Flow (12 million updates/minute!)
```
Driver App (every 5 seconds):
  WebSocket to Location Service: { driverId, lat, lng, heading, speed }

Location Service:
  1. Validate driver is active
  2. Update Redis: GEOADD drivers:online <lng> <lat> <driver_id>
  3. If driver has active trip:
     a. Publish to Kafka: "location.updated" (for rider's live map)
     b. Update ETA estimate (Maps API, cached)
  4. Heartbeat: set "driver:{id}:heartbeat" TTL=30s
     If expired mark driver offline

Why Kafka between location updates?
  - 12M/min location updates do not all need immediate DB writes
  - Kafka buffers, batch writes to PostgreSQL every 30s
  - Only for billing (distance calc) and audit
```

---

## 4. 🤝 Matching Algorithm — Nearest Driver

```
Step-by-step matching when rider requests:

1. Rider posts: POST /api/rides/request
   { pickup_lat, pickup_lng, vehicle_type: 'sedan' }

2. Pricing Service calculates fare estimate

3. Matching Service:
   a. GEOSEARCH drivers:online:{vehicle_type}
      FROMLONLAT <pickup_lng> <pickup_lat>
      BYRADIUS 3 km ASC COUNT 5
   
   b. Filter: Remove busy drivers, low-rated drivers
   
   c. Score each candidate:
      Score = (distance x -1) + (rating x 0.5) + (acceptance_rate x 0.3)
   
   d. Send request to TOP driver

4. Driver gets push notification:
   { riderId, pickup, dropoff, estimatedFare, expiresIn: 15s }

5. If driver ACCEPTS within 15s:
   Mark trip 'accepted', notify rider, start real-time tracking

6. If driver REJECTS / times out:
   Remove driver from this request, Move to next driver in ranked list

7. If all candidates reject (>5 min elapsed):
   "No drivers available" response to rider
```

---

## 5. 🔌 API Structure

### Rider APIs
```
POST /api/rides/estimate           → Get fare estimate
POST /api/rides/request            → Book ride
GET  /api/rides/:id                → Get ride status + driver location
POST /api/rides/:id/cancel         → Cancel ride
PUT  /api/rides/:id/rate           → Rate driver after trip
GET  /api/drivers/nearby           → Show nearby drivers on map
GET  /api/me/rides                 → Ride history
```

### Driver APIs
```
POST /api/driver/status            → Go online/offline
POST /api/driver/location          → Update location (WebSocket heartbeat)
POST /api/driver/rides/:id/accept  → Accept ride request
POST /api/driver/rides/:id/reject  → Reject ride request
PUT  /api/driver/rides/:id/status  → Update trip status (arrived/started/ended)
GET  /api/driver/earnings          → Daily/weekly earnings
```

---

## 6. 💰 Surge / Dynamic Pricing

```
Surge = Demand / Supply in a geographic cell

Algorithm:
1. Divide the city into hexagonal cells (H3 library by Uber)
   Each cell approx 1 km squared area

2. For each cell, every 1 minute:
   demand  = active ride requests in cell (last 5 min)
   supply  = available drivers in cell
   ratio   = demand / supply

3. Surge multiplier table:
   ratio < 1.5 → 1.0x (normal)
   ratio 1.5-2 → 1.5x surge
   ratio 2-3   → 2.0x surge
   ratio > 3   → 3.0x surge (capped to prevent gouging)

4. Show surge area on rider's map (heatmap)
5. Show surge earnings on driver's app (incentive to move)

Implementation:
  Redis: Store cell demand/supply counters
  INCR demand:cell:{h3_id}  (TTL 5 min rolling window)
  INCR supply:cell:{h3_id}  (update when driver goes online/offline)
  Calculate ratio to determine multiplier
```

---

## 7. 🗺️ ETA Calculation

```
ETA = time from driver's current location to rider's pickup

External: Google Maps Distance Matrix API / MapBox
  Very accurate, accounts for real-time traffic
  Cost: ~$5 per 1000 requests (expensive at scale!)

Optimization:
  Cache ETA by (origin_cell, destination_cell, time_of_day):
  Key: "eta:{fromH3}:{toH3}:{hour}"
  TTL: 2 minutes (traffic changes)
  
  Cache hit rate: 80% (same routes repeatedly requested)
  Saves 80% of Google Maps API cost!

Distance Calculation (quick, offline):
  Haversine formula for as-crow-flies distance
  Multiply by 1.3 (road factor) for rough ETA estimate
  Use for matching (exact ETA polled less frequently)
```

---

## 8. ⚡ Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| Driver locations | Redis GEO | 30s (heartbeat) | Core matching data |
| Trip status | Redis | Trip duration | Avoid DB reads |
| ETA estimates | Redis | 2 min | Reduce Maps API cost |
| Surge multiplier | Redis | 1 min | Recalculated per minute |
| Driver availability | Redis | 30s (heartbeat) | Fast availability check |
| Nearby drivers (map dots) | Redis | 5 sec | Rider's map |

---

## 9. 📈 Scaling Strategy

### Location Service (12M updates/min = 200K/sec!)
```
Single Redis GEOADD = ~100 microseconds
200K/sec needs high-throughput Redis
Solution: Redis Cluster with geo-partitioned shards
  - City A: redis-shard-1
  - City B: redis-shard-2
  - Each shard handles one geographic region

Or: Geohash-based partition
  Driver lat/lng to geohash prefix to assign to shard
```

### Matching Service
```
Stateless → scale horizontally
Bottleneck is Redis GEO queries (very fast, not a bottleneck)
1 Matching server: ~5,000 req/sec
10 servers for 50K concurrent bookings easily
```

### Database
```
Trips table:
- Partition by requested_at (monthly)
- Shard by city_id (each city = separate DB)
- Archive completed trips > 6 months to cold storage
- 1M concurrent trips = 1M active rows = trivial for PostgreSQL
```

---

## 10. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Fake GPS** | Mock location detection (speed too high, impossible jump) |
| **Trip manipulation** | Server-side fare calculation (never trust client GPS) |
| **Account sharing** | Device fingerprinting, one active session per driver |
| **RideShare fraud** | OTP verification at pickup (driver confirms rider) |
| **Surge abuse** | Detect drivers creating fake demand by going offline |
| **Payment fraud** | Card verification + driver payment via wallet |
| **Personal data** | Never show full home address in driver's view |

---

## 11. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Driver location at scale** | 12M updates/min | Redis GEO + Kafka buffer |
| **Driver goes offline undetected** | WebSocket dies silently | 30s heartbeat TTL in Redis |
| **All drivers reject ride** | Rider waits forever | Show wait time estimate, cancel option |
| **Surge pricing backlash** | Users upset at 3x | Show surge clearly upfront, cap at 3x |
| **Maps API cost** | 1M rides/day = huge cost | Cache ETA by H3 cell + time bucket |
| **GPS inaccuracy** | Driver appears in building | Dead reckoning + Kalman filter smoothing |
| **Concurrent matching** | 2 services match same driver to 2 riders | Redis SETNX lock per driverId before offer |

---

## 📝 Summary Box

```
┌────────────────────────────────────────────────┐
│  RIDE SHARING — KEY DECISIONS                  │
│                                                │
│  Location:    Redis GEO (GEOSEARCH)            │
│  Matching:    Nearest + scored ranking         │
│  Real-time:   WebSocket (both apps)            │
│  Location scale: Redis Cluster by city         │
│  Surge:       H3 hexagonal cells + ratio       │
│  ETA:         Cache by H3 cell (Maps API cost) │
│  Trip state:  Redis (active) + PostgreSQL (DB) │
│  Updates:     Kafka buffer to batch DB writes  │
│  Dedup match: SETNX lock per driver            │
└────────────────────────────────────────────────┘
```

**← Previous**: [Social Media Feed](./07-Social-Media-Feed.md) | **Next**: [Video Streaming →](./09-Video-Streaming-Platform.md)
