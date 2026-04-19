/**
 * ==========================================
 * PHASE 2 MINI PROJECT: COMMAND EXECUTOR
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In complex systems (like Redux, Undo/Redo systems, or Job Queues), we 
 * often want to execute "Tasks" that are completely decoupled from 
 * the logic that triggered them. 
 * This requires mastering 'this' and 'explicit binding' to ensure 
 * the tasks run in the correct context (e.g., specific user account 
 * or database connection).
 */

"use strict";

/**
 * The 'RemoteTaskExecutor' is a central hub that runs commands 
 * in specifically requested contexts.
 */
class RemoteTaskExecutor {
    constructor() {
        this.history = [];
    }

    /**
     * Executes a command in a given context with provided arguments.
     * @param {Object} context - The object to be used as 'this'.
     * @param {Function} command - The function to execute.
     * @param {Array} args - Arguments for the command.
     */
    execute(context, command, ...args) {
        console.log(`[Executor] Booting command: ${command.name || 'Anonymous'}`);

        // Using explicit binding (apply) to run the logic in the target context
        try {
            const result = command.apply(context, args);

            this.history.push({
                timestamp: new Date(),
                command: command.name,
                context: context.label || 'Default',
                status: 'Success'
            });

            return result;
        } catch (error) {
            console.error(`[Executor] Execution failed:`, error.message);
        }
    }

    printHistory() {
        console.table(this.history);
    }
}

// --- TARGET CONTEXTS (The "Stages") ---
const productionServer = {
    label: "Production_Server",
    url: "https://api.prod.com",
    logs: []
};

const stagingServer = {
    label: "Staging_Server",
    url: "https://api.stg.com",
    logs: []
};

// --- GLOBAL COMMANDS (The "Actors") ---
function deploy(version, user) {
    console.log(`[DEPLOY] Version ${version} to ${this.url} by ${user}`);
    this.logs.push(`Deploy ${version} finished.`);
}

function clearCache(region) {
    console.log(`[CACHE] Clearing ${region} cache on ${this.url}`);
}

// --- APPLICATION START ---
const executor = new RemoteTaskExecutor();

// 1. Deploy to Production
executor.execute(productionServer, deploy, "v1.2.0", "Senior_Dev");

// 2. Clear Cache in Staging
executor.execute(stagingServer, clearCache, "EU_WEST");

// 3. Show Execution History
executor.printHistory();

/**
 * KEY LEARNING HIGHLIGHTS:
 * - this: The 'deploy' and 'clearCache' functions are defined globally but 
 *   NEVER use global state. They strictly use 'this.url'.
 * - Explicit Binding: 'executor.execute' uses '.apply()' to swap contexts 
 *   on the fly between Production and Staging.
 * - Call Stack: Each execute() call pushes a new FEC for the command onto the 
 *   stack, executes it, and then resumes the main loop.
 */
