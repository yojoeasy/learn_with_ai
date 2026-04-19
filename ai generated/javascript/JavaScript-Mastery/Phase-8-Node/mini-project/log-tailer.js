/**
 * ==========================================
 * PHASE 8 MINI PROJECT: REAL-TIME LOG TAILER
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In production (Datadog, Kibana), logs are streamed as they 
 * happen. Reading the entire file every second is expensive. 
 * This project demonstrates:
 * 1. fs.watch: Efficiently detecting file changes.
 * 2. Streams: Reading only the NEW data chunks.
 * 3. Events: Broadcasting log updates throughout the app.
 */

"use strict";

const fs = require('fs');
const EventEmitter = require('events');

/**
 * 1. THE TAILER CLASS
 * Extends EventEmitter to provide a clean API for listeners.
 */
class LogTailer extends EventEmitter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
        this.cursor = 0; // Current position in the file

        // 1. Get initial file size to start "tailing" from the end
        try {
            this.cursor = fs.statSync(filePath).size;
        } catch (e) {
            this.cursor = 0;
        }
    }

    start() {
        console.log(`[TAILER] Monitoring: ${this.filePath}`);

        // 2. Efficient Watching (OS Level Notification)
        fs.watch(this.filePath, (eventType) => {
            if (eventType === 'change') {
                this.readNewLogs();
            }
        });
    }

    async readNewLogs() {
        const stats = fs.stat(this.filePath, (err, stats) => {
            if (err) return;

            // 3. Detect if file was truncated (e.g., Log Rotation)
            if (stats.size < this.cursor) {
                this.cursor = 0;
            }

            if (stats.size > this.cursor) {
                // 4. Create a stream for ONLY the new bytes
                const stream = fs.createReadStream(this.filePath, {
                    start: this.cursor,
                    end: stats.size - 1
                });

                stream.on('data', (chunk) => {
                    this.emit('line', chunk.toString().trim());
                });

                // Update cursor to end of file
                this.cursor = stats.size;
            }
        });
    }
}

// --- PART 3: SIMULATION ---
const LOG_FILE = './app.log';

// Setup Mock Log File
try { fs.writeFileSync(LOG_FILE, 'Log system started...\n'); } catch (e) { }

const tailer = new LogTailer(LOG_FILE);

// 5. Senior Pattern: Separation of Concerns
tailer.on('line', (data) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[REAL-TIME] [${timestamp}] -> ${data}`);
});

tailer.start();

/**
 * SIMULATING WRITES
 * (This would be your server logging errors/requests in a real app)
 */
let i = 1;
const simulator = setInterval(() => {
    fs.appendFileSync(LOG_FILE, `User login attempt #${i++}\n`);
    if (i > 5) clearInterval(simulator);
}, 2000);

/**
 * SENIOR HIGHLIGHTS:
 * - Efficient I/O: We never read the whole file. We only read 
 *   the bytes between 'cursor' and 'stats.size'.
 * - Event-Driven: Multiple parts of the app (analytics, security, UI) 
 *   could listen to the same tailer.
 * - Resilience: Handles Log Rotation automatically by resettting 
 *   the cursor if the file size shrinks.
 */
