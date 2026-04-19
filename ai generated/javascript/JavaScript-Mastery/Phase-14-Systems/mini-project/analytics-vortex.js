/**
 * ==========================================
 * PHASE 14 MINI PROJECT: ANALYTICS VORTEX
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In a professional environment, you don't just "save to DB". 
 * You have to handle thousands of events per second without 
 * blocking the user's request.
 * 
 * Hierarchy:
 * 1. Web API (Clustered) -> Receives Event.
 * 2. Message Queue -> Buffers Event for processing.
 * 3. Redis (Pub/Sub) -> Broadcasts processed data to Dashboard.
 * 4. Cluster Workers -> Perform the "Heavy Lift" analysis.
 */

"use strict";

const cluster = require("cluster");
const http = require("http");
const os = require("os");
const EventEmitter = require("events");

/**
 * 1. THE MOCK INFRASTRUCTURE (Simulated)
 */
const mockQueue = new EventEmitter(); // Standing in for BullMQ
const mockRedis = new EventEmitter(); // Standing in for Redis Pub/Sub

if (cluster.isPrimary) {
    const numCPUs = 4; // Simulated multi-core
    console.log(`--- [SYSTEM ENGINE] Launching Analytics Vortex (Primary: ${process.pid}) ---`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // PRIMARY LOGIC: Orchestration
    cluster.on("message", (worker, msg) => {
        if (msg.type === "EVENT_INGESTED") {
            // Drop into Queue for asynchronous processing
            mockQueue.emit("new_job", msg.payload);
        }
    });

} else {
    // --- WORKER LOGIC ---

    // 2. THE CONSUMER: Background Processing
    mockQueue.on("new_job", async (data) => {
        // console.log(`[WORKER ${process.pid}] Processing Event: ${data.id}`);

        // Heavy Math / Analytics Logic (Phase 5)
        const processed = {
            id: data.id,
            status: "ANALYZED",
            score: Math.random(),
            timestamp: Date.now()
        };

        // 3. BROADCAST: Send processed result to the "Dashboard"
        mockRedis.emit("analytics_update", processed);
    });

    // 4. THE PRODUCER: Web Ingestion API
    if (process.pid % 2 === 0) { // Let's make half of them APIs
        http.createServer((req, res) => {
            if (req.url === "/ingest") {
                const event = { id: Math.random().toString(36), type: "clicK" };

                // Send to Primary to handle queueing (Phase 14.1)
                process.send({ type: "EVENT_INGESTED", payload: event });

                res.writeHead(202); // 202 Accepted
                res.end(`Event queued by Worker ${process.pid}\n`);
            } else {
                res.writeHead(404);
                res.end();
            }
        }).listen(8080);
    }

    // 5. THE DASHBOARD: Real-time Listener
    mockRedis.on("analytics_update", (data) => {
        if (process.pid % 3 === 0) { // Just a few dashboard listeners
            console.log(`[DASHBOARD FEED] Event ${data.id} Analysis Result: ${data.score.toFixed(4)}`);
        }
    });
}

/**
 * SENIOR HIGHLIGHTS:
 * - Separation of Concerns: The API listener (Producer) is decoupled 
 *   from the Math logic (Consumer) by the Queue. If the processing 
 *   layer slows down, the API stays responsive.
 * - Horizontal Scale: To handle more traffic, we just increase 
 *   the 'numCPUs' or add more machines.
 * - Lifecycle: Using HTTP 202 (Accepted) correctly tells the 
 *   client that the data is received and will be processed later.
 */
