/**
 * ==========================================
 * PHASE 9 MINI PROJECT: PLUGIN SYSTEM
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * Platforms like Express, Webpack, and VS Code succeed because 
 * they are extensible. Users can "plug in" their own logic 
 * without modifying the core.
 * 
 * This project demonstrates:
 * 1. The Middleware Pattern (Chain of Responsibility).
 * 2. Dependency Injection via Plugins.
 * 3. Event-driven lifecycle hooks.
 */

"use strict";

/**
 * 1. THE CORE ENGINE
 */
class CoreSystem {
    constructor() {
        this.plugins = [];
        this.middleware = [];
        this.state = { data: [] };
    }

    /**
     * Plugin registration (Observer/Strategy hybrid)
     */
    use(plugin) {
        if (typeof plugin === 'function') {
            this.middleware.push(plugin);
        } else {
            this.plugins.push(plugin);
            if (plugin.init) plugin.init(this);
        }
        console.log(`[CORE] Plugin/Middleware registered.`);
    }

    /**
     * The processing pipeline (Middleware Pattern)
     */
    async process(input) {
        console.log(`[CORE] Processing input: ${JSON.stringify(input)}`);

        let context = { input, output: null };

        // 1. Run through middleware chain
        let runner = async (index) => {
            if (index === this.middleware.length) return;

            const nextMiddleware = this.middleware[index];
            await nextMiddleware(context, () => runner(index + 1));
        };

        await runner(0);

        // 2. Lifecycle hook for plugins
        this.plugins.forEach(p => {
            if (p.onProcessComplete) p.onProcessComplete(context);
        });

        return context.output;
    }
}

// --- PART 2: THE PLUGINS (External Logic) ---

/**
 * Plugin 1: A Logger Middleware
 */
const LoggerPlugin = async (ctx, next) => {
    console.log(`--- [LOG-START] ---`);
    await next(); // Wait for next in chain
    console.log(`--- [LOG-END] result: ${ctx.output} ---`);
};

/**
 * Plugin 2: Data Transformation Plugin
 */
const UppercasePlugin = async (ctx, next) => {
    ctx.input = ctx.input.map(s => s.toUpperCase());
    await next();
};

/**
 * Plugin 3: Summary Analytics (Lifecycle Listener)
 */
class AnalyticsPlugin {
    init(core) {
        console.log("[ANALYTICS] Initialized and watching CORE.");
    }

    onProcessComplete(ctx) {
        console.log(`[ANALYTICS] Final payload size: ${ctx.input.length}`);
    }
}

// --- PART 3: SIMULATION ---

async function runDemo() {
    const engine = new CoreSystem();

    // Registering plugins/middleware
    engine.use(LoggerPlugin);
    engine.use(UppercasePlugin);
    engine.use(new AnalyticsPlugin());

    // Middleware 3: The actual "worker" (End of chain)
    engine.use(async (ctx, next) => {
        ctx.output = ctx.input.join(" | ");
        // No next() call here as this is the final worker
    });

    console.log("\n--- STARTING ENGINE ---");
    const result = await engine.process(["mastering", "javascript", "architecture"]);
    console.log("FINAL OUTPUT:", result);
}

runDemo();

/**
 * SENIOR HIGHLIGHTS:
 * - Scalability: You can change the behavior of the engine 
 *   totally from the outside without touching CoreSystem.
 * - Async Management: Using an 'await next()' pattern (like Koa.js) 
 *   allows middleware to run code BEFORE and AFTER the rest of 
 *   the stack finish.
 * - Separation of Concerns: Core handles flow; Plugins handle logic.
 */
