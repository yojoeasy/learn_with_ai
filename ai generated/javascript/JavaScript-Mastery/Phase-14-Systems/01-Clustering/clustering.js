/**
 * ==========================================
 * TOPIC 01: ADVANCED CLUSTERING & IPC
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 14: Extreme Performance
 * 
 * 1. THE DEEP DIVE: WHY CLUSTER?
 * ------------------------------
 * Node.js is single-threaded (mostly). To use all cores of a 
 * modern CPU, you must run multiple instances of Node.js.
 * 
 * - Cluster Module: Built-in way to fork "worker" processes that 
 *   all share the SAME server port.
 * - Round-Robin (Linux/OSX): The Primary process accepts the 
 *   connection and distributes it to workers.
 * - Socket Sharing (Windows): The workers handle the handoff.
 * 
 * 2. PRIMARY vs WORKER
 * --------------------
 * - Primary (Master): Orchestrates workers. Doesn't do heavy logic.
 * - Worker: Does the actual work (HTTP requests, DB calls).
 * 
 * 3. IPC (INTER-PROCESS COMMUNICATION)
 * -------------------------------------
 * Workers don't share memory (unlike Web Workers in a single process). 
 * They communicate via serializable JSON messages over pipes.
 * 
 * 4. VISUAL MENTAL MODEL: THE RESTAURANT
 * --------------------------------------
 * - Single Process: One waiter taking orders, cooking, and cleaning.
 * - Cluster: 
 *   - The Host (Primary): Stands at the door, greets guests, and 
 *     assigns them to a table.
 *   - The Waiters (Workers): Each stands at a different table (Core) 
 *     and does the actual work.
 */

"use strict";

const cluster = require("cluster");
const http = require("http");
const os = require("os");

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`[PRIMARY] Managing ${numCPUs} CPU cores. PID: ${process.pid}`);

    // 1. Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // 2. Health Monitoring: Auto-restart on crash
    cluster.on("exit", (worker, code, signal) => {
        console.error(`[PRIMARY] Worker ${worker.process.pid} died. Forking replacement...`);
        cluster.fork();
    });

    // 3. BROADCAST: Send message to all workers
    let count = 0;
    setInterval(() => {
        count++;
        for (const id in cluster.workers) {
            cluster.workers[id].send({ cmd: "update_counter", value: count });
        }
    }, 5000);

} else {
    // --- WORKER LOGIC ---
    let localCounter = 0;

    // 4. IPC LISTEN: Receive from Primary
    process.on("message", (msg) => {
        if (msg.cmd === "update_counter") {
            localCounter = msg.value;
            // console.log(`[WORKER ${process.pid}] Synced counter: ${localCounter}`);
        }
    });

    // 5. SHARED PORT: All workers listen on 8080
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from Worker ${process.pid} | Global Sync: ${localCounter}\n`);
    }).listen(8080);

    console.log(`[WORKER] Started on PID: ${process.pid}`);
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Does clustering make a single request faster?
 * A1: NO. It increases "Throughput" (Total requests per second). 
 *     A single request still runs on one core.
 * 
 * Q2: What happens to a connection if a worker crashes?
 * A2: The connection is usually severed. This is why you need 
 *     "Graceful Shutdown" (closing listeners before exiting).
 * 
 * Q3: Can workers share a global variable?
 * A3: NO. They are separate OS processes. You must use IPC or a 
 *     distributed store like Redis (Topic 14.2).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I have 8 cores and I fork 100 workers, what happens?
 * (Answer: The OS will context-switch between them. This is 
 *  actually SLOWER than forking 8 workers because of the overhead.)
 * 
 * Q2: Is there a way to communicate between two WORKERS directly?
 * (Answer: Not directly. You must go Worker A -> Primary -> Worker B.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Weighting" system in the Primary to 
 *              restart workers gradually (Zero-Downtime Reload).
 * Challenge 2: Benchmarking: Use `autocannon` to compare a 
 *              single Node script vs a Cluster of 4.
 */
