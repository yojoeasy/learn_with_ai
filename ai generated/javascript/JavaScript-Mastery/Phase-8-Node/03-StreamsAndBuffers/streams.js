/**
 * ==========================================
 * TOPIC 03: STREAMS & BUFFERS (V8 Memory)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Node.js handles massive datasets without crashing via STREAMS. 
 * Instead of loading 1GB into memory, you process it chunk-by-chunk.
 * 
 * - Buffers: Raw memory allocation outside the V8 heap. 
 *   Used for binary data.
 * - Streams: Abstract interfaces for handling chunked data.
 *   - Readable (e.g., fs.createReadStream)
 *   - Writable (e.g., fs.createWriteStream)
 *   - Duplex (Read + Write, like TCP sockets)
 *   - Transform (Modifies data, like Zlib compression)
 * 
 * 2. INTERNAL WORKING (BACKPRESSURE)
 * -----------------------------------
 * Backpressure is the state where a Writable stream can't keep 
 * up with the speed of a Readable stream. 
 * Node.js manages this by pausing the Readable stream when the 
 * internal buffer of the Writable stream is full.
 * 
 * 3. VISUAL MENTAL MODEL: THE BRICK FACTORY
 * -----------------------------------------
 * - Buffer: A small tray that can hold 10 bricks. 
 * - Streams: A conveyor belt system. 
 *   - Readable: The machine putting bricks on the belt. 
 *   - Writable: The machine taking bricks off at the other end. 
 *   - Backpressure: If the "taker" machine is too slow, the belt 
 *     automatically STOPS to prevent bricks from falling off.
 * 
 * 4. PERFORMANCE HINT: PIPE & PIPELINE
 * ------------------------------------
 * `readable.pipe(writable)` handles backpressure automatically. 
 * In production, use `pipeline` from the `stream` module for 
 * better error handling and automatic cleanup.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Memory Fragmentation: Allocating thousands of tiny Buffers 
 *   can lead to external memory fragmentation.
 * - Error Handling: Streams emit 'error' events. If not caught, 
 *   the entire process crashes.
 */

// --- ONE BAD EXAMPLE: Loading large files into memory ---
const fs = require('fs');
function badRead() {
    // This will CRASH if the file is larger than the available V8 heap.
    fs.readFile('large_video.mp4', (err, data) => {
        // data is a giant Buffer in memory! (OOM Risk)
        console.log(data.length);
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Streams) ---
"use strict";

const { pipeline } = require("stream");
const zlib = require("zlib");

/**
 * Senior pattern: Streaming with Pipeline
 */
function streamCompress(sourcePath, destPath) {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);
    const zip = zlib.createGzip();

    // 1. Pipeline handles backpressure and errors automatically
    pipeline(
        readStream,
        zip,
        writeStream,
        (err) => {
            if (err) {
                console.error("[STREAM ERROR]:", err.message);
            } else {
                console.log("[SUCCESS]: Compression complete.");
            }
        }
    );
}

/**
 * UNDERSTANDING BUFFERS
 */
const buf = Buffer.alloc(10); // Allocated outside V8 heap
buf.write("Node.js");
console.log(buf.toString()); // Raw binary to string

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is "Backpressure" in Node.js streams?
 * A1: It's a mechanism that slows down the source (Readable) 
 *     when the destination (Writable) is busy, ensuring 
 *     memory usage doesn't spike.
 * 
 * Q2: Where is Buffer memory allocated?
 * A2: Outside the V8 V8 heap, in the "External Memory" 
 *     of the Node.js process.
 * 
 * Q3: Difference between .pipe() and pipeline()?
 * A3: .pipe() is simpler but doesn't handle cleanup or errors 
 *     well. pipeline() is the modern standard that manages 
 *     memory cleanup across all streams automatically.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If a stream is in "Paused Mode", how do you start it?
 * (Answer: By calling .resume() or by attaching a 'data' listener.)
 * 
 * Q2: What happens if you write to a Writable stream after 
 *     it returns 'false' for .write()?
 * (Answer: The data still gets buffered in RAM, but this 
 *  violates backpressure rules and could lead to OOM crashes.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Log the memory usage using `process.memoryUsage().external` 
 *              while reading a 500MB file via stream vs readFile.
 * Challenge 2: Build a custom "Transform Stream" that converts 
 *              lowercase text to uppercase as it passes through.
 */
