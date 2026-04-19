# 🎬 System Design #09 — Video Streaming Platform
> **Like**: YouTube, Netflix, Prime Video, Hotstar  
> **Difficulty**: ⭐⭐⭐⭐⭐ | **Teaches**: Transcoding, HLS/DASH, CDN, Adaptive Bitrate

---

## 📋 Requirements

### Functional Requirements
- Upload videos (up to 50 GB for creators)
- Stream videos in multiple qualities (360p, 480p, 720p, 1080p, 4K)
- Adaptive Bitrate Streaming (auto-adjust quality based on network)
- Search videos (title, tags, description)
- Like, comment, subscribe
- Recommendations
- Live streaming (for Netflix-like, pre-processed; for YouTube, live encoder)
- Resume playback from where user left off

### Non-Functional Requirements
- **Users**: 2 billion registered, 500 million DAU
- **Videos**: 500 hours of video uploaded every minute
- **Views**: 1 billion views/day ≈ **11,574 views/second**
- **Storage**: 1 min HD video ≈ 100 MB → 500 × 60 min × 100 MB = **3 PB/day**
- **Availability**: 99.99% — buffering kills user experience
- **Latency**: Video starts within 2 seconds
- **Budget**: Very High
- **Tech**: Node.js, GoLang, FFmpeg, AWS S3, CloudFront CDN, Kafka, PostgreSQL, Elasticsearch

---

## 1. 🏛️ High-Level Architecture

```
[Creator Upload]
      │
      ▼
[Upload Service]        → Accept raw video, store in S3 (raw bucket)
      │
      ▼
[Kafka: video.uploaded event]
      │
      ▼
[Transcoding Pipeline]  → Convert to multiple formats/qualities
  ├─ Worker 1: 360p MP4
  ├─ Worker 2: 720p MP4
  ├─ Worker 3: 1080p MP4
  └─ Worker 4: 4K MP4 + Audio tracks
      │
      ▼
[S3: processed bucket]  → Store all encoded versions
      │
      ▼
[CDN: CloudFront]      → Serve video segments globally
      │
      ▼
[Viewer's Browser/App]  → Adaptive Bitrate Streaming (HLS/DASH)

                 ┌─────── Other Services ─────────┐
                 │ [Metadata Service] PostgreSQL   │
                 │ [Search Service]   Elasticsearch│
                 │ [Recommendation]   ML Service   │
                 │ [Analytics]        ClickHouse   │
                 └────────────────────────────────-┘
```

---

## 2. 📹 Video Processing Pipeline — The Core

### Step 1: Upload
```
Problem: 50 GB videos can't upload in single HTTP request
Solution: Chunked resumable upload (same as file storage system)

1. Creator: POST /api/upload/initiate
   Response: { uploadId, videoId }

2. Client splits video into 5 MB chunks
3. Each chunk uploaded to S3 via presigned URL
4. When all parts uploaded → POST /api/upload/complete
5. S3 assembles chunks → raw_videos/{videoId}/original.mp4
6. Event published to Kafka: "video.upload.completed"
```

### Step 2: Transcoding (FFmpeg)
```
Transcoding = Converting raw video to multiple formats/resolutions

Input:  raw_videos/{videoId}/original.mp4 (any format: MOV, AVI, MKV)
Output: 
  processed/{videoId}/360p.mp4
  processed/{videoId}/480p.mp4  
  processed/{videoId}/720p.mp4
  processed/{videoId}/1080p.mp4
  processed/{videoId}/4k.mp4
  processed/{videoId}/thumb.jpg     (thumbnail, frame at 10s)
  processed/{videoId}/playlist.m3u8  (HLS master playlist)

FFmpeg commands (example):
ffmpeg -i original.mp4 -vf scale=640:360 -c:v libx264 -b:v 800k 360p.mp4
ffmpeg -i original.mp4 -vf scale=1280:720 -c:v libx264 -b:v 2500k 720p.mp4
ffmpeg -i original.mp4 -vf scale=1920:1080 -c:v libx264 -b:v 5000k 1080p.mp4

Transcoding is CPU-intensive!
  → Use dedicated GPU-powered EC2 instances (P3 or G4 type)
  → Auto-scale based on queue depth
  → 1 hour of 4K video takes ~30 min to transcode
```

### Step 3: HLS Segmentation
```
HLS = HTTP Live Streaming (Apple standard, universally supported)
DASH = Dynamic Adaptive Streaming over HTTP (Google/MPEG standard)

Process:
  Each resolution → cut into 10-second segments (.ts files)
  + Generate manifest file (.m3u8 playlist)

Output structure:
  /processed/videoAbc/
    ├── master.m3u8          ← Master playlist (all qualities)
    ├── 360p/
    │   ├── playlist.m3u8   ← Points to 360p segments
    │   ├── seg_001.ts
    │   ├── seg_002.ts
    │   └── ...
    ├── 720p/
    │   ├── playlist.m3u8
    │   ├── seg_001.ts
    │   └── ...
    └── 1080p/
        ├── playlist.m3u8
        └── ...

master.m3u8 content:
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
```

---

## 3. 🌐 Adaptive Bitrate Streaming (ABR)

```
Problem: User on 4G → switches to 2G midway through video.
         Should video buffer? NO — switch to lower quality!

How ABR works:
1. Browser loads master.m3u8 (lists all quality options)
2. Browser measures current download speed (bandwidth estimation)
3. Selects best quality that can stream without buffering
4. Downloads next segment at chosen quality
5. Continuously re-evaluates → switches quality every ~10s if needed

Buffer strategy:
  Prefetch: Download 30 seconds ahead (smooth experience)
  If buffer drops < 10s → switch to lower quality immediately
  If buffer grows > 60s → can switch to higher quality

User sees: "Quality: Auto" — switches invisibly

YouTube's algorithm:
  - BOLA (Buffer Occupancy based Lyapunov Algorithm)
  - Balance: highest quality + minimal stalls
```

---

## 4. 🗄️ Database Design

### Videos Table (PostgreSQL)
```sql
CREATE TABLE videos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id     UUID NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    tags            TEXT[],
    category        VARCHAR(50),
    
    -- Processing status
    status          VARCHAR(20),  -- 'uploading'|'processing'|'ready'|'failed'
    
    -- Files
    raw_s3_key      VARCHAR(500),   -- original upload location
    thumbnail_url   VARCHAR(500),
    hls_playlist    VARCHAR(500),   -- master.m3u8 URL
    
    -- Metadata
    duration_sec    INTEGER,
    file_size_bytes BIGINT,
    
    -- Stats (cached aggregates)
    view_count      BIGINT DEFAULT 0,
    like_count      BIGINT DEFAULT 0,
    comment_count   INTEGER DEFAULT 0,
    
    -- Visibility
    visibility      VARCHAR(10) DEFAULT 'public',  -- 'public'|'private'|'unlisted'
    
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_uploader ON videos(uploader_id, published_at DESC);
CREATE INDEX idx_videos_category ON videos(category, view_count DESC);
```

### View Tracking (ClickHouse — analytics, not PostgreSQL!)
```sql
-- ClickHouse is columnar, optimized for aggregations
CREATE TABLE video_views (
    video_id        UUID,
    user_id         UUID,        -- null for anonymous
    session_id      UUID,
    watch_duration  INTEGER,     -- seconds watched
    quality         VARCHAR(10), -- '360p'|'720p'|'1080p'
    device          VARCHAR(20),
    country         VARCHAR(3),
    viewed_at       DateTime
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(viewed_at)
ORDER BY (video_id, viewed_at);

-- Fast queries:
-- Total views per video per day (for charts)
-- Watch time distribution (audience retention graph)
-- Quality breakdown by country
```

---

## 5. 🔌 API Structure

```
# Upload
POST /api/videos/upload/initiate    → Start chunked upload
GET  /api/videos/upload/:id/url     → Get presigned URL per chunk
POST /api/videos/upload/:id/complete → Finalize upload

# Videos
GET  /api/videos/:id                → Video metadata + stream URL
GET  /api/videos/:id/comments       → Comments (paginated with cursor)
POST /api/videos/:id/view           → Log view event (debounced 30s min)
POST /api/videos/:id/like           → Like/unlike
POST /api/videos/:id/comments       → Post comment

# Feed/Discovery
GET  /api/feed/home                 → Recommended videos (ML-based)
GET  /api/feed/subscriptions        → Latest from subscribed channels
GET  /api/search?q=javascript       → Search videos
GET  /api/trending                  → Trending list

# User
POST /api/channels/:id/subscribe    → Subscribe/unsubscribe
GET  /api/channels/:id              → Channel page + videos

# Playback State (resume feature)
PUT  /api/me/watchhistory/:videoId  → Save resume position
GET  /api/me/watchhistory           → Watch history
```

---

## 6. 🔢 View Count — Counting at Scale

```
Problem: 11,574 views/sec → cannot do UPDATE view_count++ for each view!
→ PostgreSQL would be destroyed

Solution 1: Redis Buffer + Periodic Flush
  INCR video_views:videoAbc        ← atomic Redis operation
  Every 1 minute: batch flush to PostgreSQL:
    UPDATE videos SET view_count = view_count + {redis_count}
    RESET redis counter

Solution 2: Kafka + Stream Processing
  Each view → Kafka event "video.viewed"
  Flink/Spark stream processor aggregates counts
  Batch update PostgreSQL every minute
  
  Benefits:
  - Dedup: Same user within 24 hours = don't count again
  - Analytics: Store individual events in ClickHouse

Dedup Logic:
  Check: "Has user X watched video Y in last 24h?"
  Redis: SETEX "viewed:user123:videoAbc" 86400 1
  If key exists → skip view count increment
```

---

## 7. 🎯 Recommendation System

```
YouTube uses multi-stage recommendation:

Stage 1: Candidate Generation (narrow from millions to hundreds)
  → Collaborative filtering: "Users like you also watched..."
  → Content-based: "You watched JavaScript → recommend Node.js"
  → Based on: watch history, likes, search history
  → Tech: Embedding similarity (cosine distance in vector space)
  → Result: 200-500 candidate videos

Stage 2: Ranking (order the 200-500 candidates)
  → ML model scores each candidate
  → Signals: predicted CTR (click rate), predicted watch time
  → User satisfaction signals: likes, shares, not-interested
  → Result: Top 20 recommendations

Stage 3: Diversity filter
  → Don't show same channel 5 times in a row
  → Mix categories
  → Inject trending items occasionally

Tech: TensorFlow + Google's YouTube recommendation paper
```

---

## 8. ⚡ Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| Video segments (.ts files) | CDN (CloudFront) | Permanent | Content-addressed, immutable |
| Thumbnails | CDN | 24 hours | Rarely change |
| Video metadata | Redis | 10 min | High read rate |
| View count | Redis | Flush every 1 min | Buffer |
| Recommendations | Redis | 1 hour | ML results |
| Search results | Redis | 5 min | Popular queries |
| Subscription feed | Redis | 5 min | New uploads |

### CDN Strategy
```
CloudFront PoP (Points of Presence) near users:
- Mumbai PoP serves Indian users
- London PoP serves European users
- US East PoP serves American users

Video segments: cached at PoP permanently (never change)
Cache hit rate: 95%+ for popular videos

Origin Shield: Single CloudFront region that always caches from S3
→ Prevents S3 being hammered when CDN cache misses
```

---

## 9. 📈 Scaling Strategy

### Upload Pipeline
```
Raw video storage: S3 (unlimited scale)
Transcoding:
- Queue-based: Kafka "video.uploaded" → Transcoding Worker Pool
- Workers: Auto-scale EC2 GPU instances based on queue depth
- 500h upload/min → thousands of transcoding jobs/day
- Prioritize: smaller videos first (faster to process, more content)
```

### Streaming (CDN)
```
CloudFront POPs serve 99%+ of video traffic
S3 origin only hit for rare requests (new videos, cache miss)
Multi-region S3 replication for very popular videos
CDN caches segments permanently → virtually infinite scale
```

### Database
```
PostgreSQL (videos, users):
- Read replicas for metadata reads
- Partition videos by published_at (monthly)

ClickHouse (analytics):
- Purpose-built for 11K events/sec
- Columnar storage = fast aggregations
- Shard by video_id
```

---

## 10. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Piracy** | DRM (Widevine L1, FairPlay) for premium content |
| **Copyright violation** | Content ID fingerprinting (like YouTube's system) |
| **Inappropriate content** | ML content moderation + human review |
| **Upload of malware** | Virus scan all uploads before processing |
| **Hotlinking** | Signed URLs for video segments (expire in 6 hours) |
| **Bot views** | Dedup + bot detection (browser fingerprint, headless check) |
| **Account takeover** | 2FA + login anomaly detection |
| **Geo-restriction** | CDN geo-blocking (content licensing by country) |

---

## 11. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Transcoding cost** | GPU instances are expensive | Spot instances (70% cheaper), prioritize popular vidoes |
| **Storage cost (3 PB/day!)** | Astronomical S3 cost | Lifecycle: delete raw after processing; archive old videos |
| **Long tail** | 80% videos rarely watched | Don't transcode all qualities — start with 360p/720p, transcode 1080p/4K only if views cross threshold |
| **Live streaming** | Real-time = no pre-processing | WebRTC ingestion → HLS with 2s segments → CDN |
| **First viewer** | New video not cached on CDN → slow | Accept first viewer is slower; CDN fills fast |
| **Recommendation cold start** | New user has no history | Default to trending/popular until signal builds |
| **Copyright detection** | 500h upload/min → can't manually check | Audio/video fingerprinting ML at upload time |

---

## 12. 💡 Interesting Architecture Decisions

### Why 10-second HLS segments?
```
Short (2s): More HTTP requests but faster quality switching
Long (30s): Fewer requests but slow quality adaptation
10s: Sweet spot — Netflix uses 2-4s, YouTube uses ~10s
```

### Why store raw video after transcoding?
```
Keep raw: 30 days → user might request deletion (GDPR)
Keep raw: Also if you improve codec (AV1 > H.264) → re-transcode from raw
Delete raw after 30 days → save storage cost
```

---

## 📝 Summary Box

```
┌───────────────────────────────────────────────────┐
│  VIDEO STREAMING — KEY DECISIONS                  │
│                                                   │
│  Upload:      Chunked multipart to S3             │
│  Transcode:   FFmpeg + GPU workers (Kafka queue)  │
│  Format:      HLS (m3u8 + ts segments)            │
│  Adaptive:    ABR (auto quality switch)           │
│  Serving:     CloudFront CDN (99% traffic)        │
│  Views:       Redis buffer → batch flush          │
│  Analytics:   ClickHouse (columnar)               │
│  Recommend:   Multi-stage ML (candidate+ranking)  │
│  DRM:         Widevine + FairPlay for premium     │
│  Cost:        Spot EC2 + lifecycle policies       │
└───────────────────────────────────────────────────┘
```

**← Previous**: [Ride Sharing App](./08-Ride-Sharing-App.md) | **Next**: [Distributed Logging →](./10-Distributed-Logging-System.md)
