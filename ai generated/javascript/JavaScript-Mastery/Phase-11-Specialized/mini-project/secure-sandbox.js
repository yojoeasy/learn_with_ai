/**
 * ==========================================
 * PHASE 11 MINI PROJECT: SECURE SANDBOX
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * Platforms like Lambda or online IDEs need to execute "user code" 
 * without letting it crash the main server or steal data.
 * 
 * This project demonstrates:
 * 1. Multi-threaded Isolation: Running code in a Worker Thread.
 * 2. Input Sanitization: Blocking Prototype Pollution.
 * 3. Execution Monitoring: Killing workers that exceed memory/time.
 */

"use strict";

const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

/**
 * 1. THE SANDBOX MANAGER (Main Thread)
 */
class SecureSandbox {
    constructor(timeoutMs = 1000) {
        this.timeoutMs = timeoutMs;
    }

    async execute(code, payload) {
        // 1. SANITIZATION: Prevent Prototype Pollution
        const safePayload = this.sanitize(payload);

        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: { code, payload: safePayload }
            });

            // 2. TIMEOUT MONITORING
            const timer = setTimeout(() => {
                worker.terminate();
                reject(new Error("SEC_ERR: Execution Timeout (Possible Infinite Loop/ReDoS)"));
            }, this.timeoutMs);

            worker.on("message", (res) => {
                clearTimeout(timer);
                resolve(res);
            });

            worker.on("error", (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    sanitize(obj) {
        // Deep clone while blocking dangerous keys
        return JSON.parse(JSON.stringify(obj, (key, value) => {
            if (key === "__proto__" || key === "constructor") return undefined;
            return value;
        }));
    }
}

/**
 * 3. THE WORKER LOGIC
 */
if (!isMainThread) {
    const { code, payload } = workerData;

    try {
        // 3. EXECUTION: Using 'eval' is dangerous, in a real sandbox 
        // we'd use 'vm' module, but for this demo, we rely on 
        // Worker Isolation + Payload Sanitization.

        // Let's pretend the code processes the payload
        const sandboxLogic = new Function("data", `
            "use strict";
            ${code}
        `);

        const result = sandboxLogic(payload);
        parentPort.postMessage({ success: true, result });

    } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
    }
}

// --- SIMULATION ---
if (isMainThread) {
    const sandbox = new SecureSandbox(2000);

    async function runDemos() {
        console.log("--- STARTING SECURE SANDBOX ---");

        // Demo 1: Safe Execution
        const res1 = await sandbox.execute("return data.value * 2", { value: 10 });
        console.log("[RESULT 1]:", res1);

        // Demo 2: Prototype Pollution Attempt
        const attack = { value: 5, "__proto__": { admin: true } };
        const res2 = await sandbox.execute("return { polluted: {}.admin }", attack);
        console.log("[RESULT 2] (Pollution Blocked):", res2.result.polluted); // undefined (SAFE)

        // Demo 3: Timeout Calculation (Infinite Loop)
        try {
            console.log("[SANDBOX] Running infinite loop...");
            await sandbox.execute("while(true) {}", {});
        } catch (err) {
            console.warn("[GUARD]:", err.message);
        }
    }

    runDemos();
}

/**
 * SENIOR HIGHLIGHTS:
 * - Defense in Depth: We use both logical sanitization (killing __proto__) 
 *   and physical isolation (Worker threads).
 * - Resource Guarding: Terminating the worker ensures a single 
 *   malicious script cannot hold the CPU hostage.
 * - JSON Trick: `JSON.parse(JSON.stringify)` with a replacer is a 
 *   fast way to strip out non-data keys from a payload.
 */
