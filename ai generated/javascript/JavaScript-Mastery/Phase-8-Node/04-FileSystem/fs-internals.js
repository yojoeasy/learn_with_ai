/**
 * ==========================================
 * TOPIC 04: FILE SYSTEM & PATH INTERNALS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Node.js is "Non-Blocking" for I/O. For file system operations, 
 * it uses the LIBUV thread pool to offload work.
 * 
 * - Sync vs Async: 
 *   - Sync (fs.readFileSync): Blocks the event loop. NEVER use 
 *     in a production server (except at startup).
 *   - Async (fs.readFile): Uses a callback. 
 *   - Promises (fs.promises): The modern standard.
 * 
 * 2. PATH RESOLUTION
 * -------------------
 * - path.join(): Safe cross-platform path concatenation. 
 * - path.resolve(): Converts a path into an absolute path 
 *   based on the current working directory.
 * 
 * 3. INTERNAL WORKING (LIBUV THREAD POOL)
 * ----------------------------------------
 * When you call `fs.readFile`, Node.js sends the request to Libuv. 
 * Libuv assigns a thread (from its pool of 4 by default) to wait 
 * for the disk I/O. The main JS thread continues running.
 * 
 * 4. VISUAL MENTAL MODEL: THE OFFICE ASSISTANT
 * --------------------------------------------
 * Think of your JS script as the "Manager".
 * - Sync: The manager goes to the filing cabinet and waits until 
 *   the folder is found. Work stops.
 * - Async: The manager tells an "Assistant" (Libuv thread) 
 *   to find the folder and ring a bell (Callback) when it's ready. 
 *   The manager keeps making calls in the meantime.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - File Handles: Opening too many files without closing them 
 *   leads to 'EMFILE' (Too many open files) error.
 * - Watchers: recursive `fs.watch` can be buggy on some OS versions. 
 *   Use the `chokidar` library in production.
 */

// --- ONE BAD EXAMPLE: Nested Callbacks (Hell) ---
function badFs() {
    fs.readdir(".", (err, files) => {
        fs.readFile(files[0], (err, data) => {
            fs.writeFile("out.txt", data, (err) => {
                // Nested mess!
            });
        });
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Modern FS) ---
"use strict";

const fs = require("fs/promises");
const path = require("path");

/**
 * Senior pattern: Async/Await + Path resolution
 */
async function processConfig() {
    try {
        // 1. Safe absolute path
        const configPath = path.resolve(__dirname, "config.json");

        // 2. Non-blocking Promise-based read
        const data = await fs.readFile(configPath, "utf-8");
        const json = JSON.parse(data);

        // 3. Recursive directory creation (new in Node 10+)
        await fs.mkdir(path.join(__dirname, "logs"), { recursive: true });

        console.log("[FS SUCCESS]: Config loaded and logs DIR verified.");
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error("[FS ERROR]: Config file not found.");
        } else {
            console.error("[FS ERROR]:", err.message);
        }
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between path.join and path.resolve?
 * A1: .join merely concatenates segments using the OS separator. 
 *     .resolve always returns an absolute path relative to the 
 *     current directory.
 * 
 * Q2: How many threads does Libuv use for File System I/O?
 * A2: By default, 4 threads. This can be increased using 
 *     the `UV_THREADPOOL_SIZE` environment variable.
 * 
 * Q3: Why shouldn't you use fs.existsSync() before fs.open()?
 * A3: It's a "Race Condition" (TOCTOU: Time of check to time of use). 
 *     The file might be deleted between the check and the open. 
 *     Just try to open and handle the error.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Does 'fs.promises' use the same thread pool as callbacks?
 * (Answer: Yes. It's just a wrapper over the same Libuv logic.)
 * 
 * Q2: What happens if you run fs.readFileSync in an HTTP request handler?
 * (Answer: Every other request to the server will wait until 
 *  the disk operation is finished (Blocking). High latency!)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Recursive File Searcher" that finds all 
 *              .js files in a directory and its subdirectories.
 * Challenge 2: Use `fs.watch` to build a simple "Live Reloader" 
 *              that restarts a function when a file changes.
 */
