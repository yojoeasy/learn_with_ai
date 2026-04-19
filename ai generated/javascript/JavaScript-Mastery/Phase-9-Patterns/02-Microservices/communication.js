/**
 * ==========================================
 * TOPIC 02: MICROSERVICES & COMMUNICATION
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * In a microservices architecture, independent services need to 
 * talk to each other. Unlike a monolith, these calls happen 
 * over the network.
 * 
 * - Webhooks: A "Push" notification from one server to another 
 *   via HTTP POST.
 * - Pub/Sub: An asynchronous message patterns using a broker 
 *   (like Redis or RabbitMQ).
 * - Eventual Consistency: State is not synchronized immediately; 
 *   it "catches up" over time.
 * 
 * 2. IDEMPOTENCY (CRITICAL PRINCIPLE)
 * -----------------------------------
 * In distributed systems, a message might be sent twice (Network error). 
 * An "Idempotent" operation is one that can be performed multiple 
 * times without changing the result beyond the initial application.
 * 
 * 3. INTERNAL WORKING (WEBHOOK SECURITY)
 * ---------------------------------------
 * Since webhooks are just HTTP endpoints, you MUST verify the 
 * sender. This is usually done by signing the payload with 
 * a "Secret Key" and sending a hash in the header.
 * 
 * 4. VISUAL MENTAL MODEL: THE POSTAL SYSTEM
 * ------------------------------------------
 * - Monolith: You talk to your colleague across the desk. 
 * - Microservices: You send a physical letter (Message). 
 *   - Webhook: You leave a note on their door.
 *   - Pub/Sub: You post an announcement on a bulletin board 
 *     (Broker). Anyone interested can read it.
 *   - Eventual Consistency: You sent the letter; you trust 
 *     it will arrive, but you don't wait for the reply 
 *     to keep working.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Network Latency: Every call adds 20-200ms of overhead.
 * - Cascading Failures: If Service A waits for Service B, and B is slow, 
 *   A will eventually time out and fail too. Use "Circuit Breakers".
 */

// --- ONE BAD EXAMPLE: No Idempotency check ---
async function badProcessPayment(webhookData) {
    // If the same webhook is sent twice, the user is charged twice!
    await chargeUser(webhookData.amount);
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Communication) ---
"use strict";

const crypto = require("crypto");

/**
 * 1. SECURE WEBHOOK HANDLER (Verification)
 */
function handleStripeWebhook(payload, signature, secret) {
    // Using HMAC-SHA256 to verify sender
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    if (signature !== expectedSignature) {
        throw new Error("Invalid signature: Potential CSRF/Attack!");
    }
    console.log("[WEBHOOK] Verified signature. Processing safely...");
}

/**
 * 2. IDEMPOTENT PROCESSING (Senior logic)
 */
const processedEvents = new Set(); // In production, use Redis

async function idempotentProcess(event) {
    // 1. Check if we already handled this unique ID
    if (processedEvents.has(event.id)) {
        console.log(`[EVENT] Ignoring duplicate message: ${event.id}`);
        return;
    }

    // 2. Perform the logic
    try {
        await saveToDatabase(event);
        // 3. Mark as processed ONLY after success
        processedEvents.add(event.id);
    } catch (err) {
        console.error("Failed to process event.");
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a Webhook?
 * A1: It's an HTTP POST callback that occurs when something happens; 
 *     a simple way for an app to provide real-time information to 
 *     another app.
 * 
 * Q2: How do you handle "Eventual Consistency"?
 * A2: By designing the UI to handle "Pending" states and using 
 *     polling or WebSockets to update the user when the background 
 *     process eventually completes.
 * 
 * Q3: What is a "Circuit Breaker"?
 * A3: A pattern that stops making requests to a service that is 
 *     known to be failing, preventing a cascade of errors.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If Service A sends a message to Service B, and Service B 
 *     returns 200 OK but then crashes before saving, is the 
 *     system consistent?
 * (Answer: No. This is why we use "Message Retries" and 
 *  Idempotency keys to ensure the operation results in 1 save.)
 * 
 * Q2: Why use a Message Broker instead of direct HTTP calls?
 * (Answer: For decoupling, scalability, and "Load Leveling" during 
 *  traffic spikes.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Hmac Verification" middleware for 
 *              an Express.js route.
 * Challenge 2: Simulate a "Retry Loop" with exponential backoff 
 *              for a failing microservice call.
 */

// Helper
async function saveToDatabase(e) { return true; }
