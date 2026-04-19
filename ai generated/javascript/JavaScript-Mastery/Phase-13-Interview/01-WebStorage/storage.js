/**
 * ==========================================
 * TOPIC 01: WEB STORAGE (Local, Session, Cookies)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Persistence & Security
 * 
 * 1. THE DEEP DIVE: STORAGE MECHANISMS
 * ------------------------------------
 * To provide a persistent user experience, we must store data 
 * between page refreshes and browser sessions.
 * 
 * - LocalStorage: Persistent data (no expiration). Survive browser restart.
 * - SessionStorage: Data lasts for the life of the tab/window session.
 * - Cookies: Data sent to the server with every HTTP request.
 * 
 * 2. CAPACITY & LIMITS
 * --------------------
 * - Local/Session: ~5-10MB (Browser-dependent). synchronous API.
 * - Cookies: ~4KB. asynchronous/synchronous depending on API.
 * 
 * 3. INTERNAL WORKING (DOMAIN ISOLATION)
 * ---------------------------------------
 * Storage is isolated by Origin (Protocol + Domain + Port). 
 * LocalStorage in `a.com` cannot see LocalStorage in `b.com`.
 * 
 * 4. SECURITY & BEST PRACTICES
 * ----------------------------
 * - XSS Risk: LocalStorage is accessible via JS. If your site has XSS, 
 *   your tokens/secrets are GONE.
 * - HttpOnly Cookies: Secure way to store session tokens as they are 
 *   INACCESSIBLE to JavaScript.
 * - SameSite: Cookie attribute to prevent CSRF attacks.
 */

// --- ONE BAD EXAMPLE: Storing Sensitive Data in LocalStorage ---
function badSetToken(token) {
    // DO NOT DO THIS: This is vulnerable to XSS theft!
    localStorage.setItem("authToken", token);
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Storage Utility) ---
"use strict";

/**
 * Encapsulated Storage Wrapper with Error Handling
 */
const storage = {
    set(key, value) {
        try {
            // LocalStorage only stores strings
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
        } catch (err) {
            // QUOTA_EXCEEDED_ERR: Handle full storage
            console.error("Storage Error:", err.message);
        }
    },

    get(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (err) {
            return data;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

/**
 * COOKIE MANAGEMENT (Advanced)
 */
const cookieJar = {
    set(name, value, days = 7) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Secure attributes: SameSite=Lax helps prevent CSRF
        document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
    }
};

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: LocalStorage vs SessionStorage vs Cookies?
 * A1: Local is persistent, Session is tab-scoped, Cookies are for 
 *     server communication.
 * 
 * Q2: What happens if LocalStorage is full?
 * A2: It throws a 'QuotaExceededError'. Always wrap .setItem in a try/catch.
 * 
 * Q3: Why is 'HttpOnly' important for cookies?
 * A3: It makes the cookie invisible to JavaScript, preventing hackers 
 *     from stealing session tokens via script injection (XSS).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I set LocalStorage in 'site.com' and visit 'blog.site.com', 
 *     can I access the data?
 * (Answer: NO. Subdomains are considered different Origins for storage 
 *  unless they are Cookies scoped differently.)
 * 
 * Q2: Does LocalStorage persist in Incognito mode?
 * (Answer: In most browsers, it is cleared once the last Incognito 
 *  window is closed. It behaves like SessionStorage.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Cache Expire" wrapper for LocalStorage 
 *              that deletes data after a TTL (Time To Live).
 * Challenge 2: Synchronize data between two tabs on the same origin 
 *              using the 'storage' event listener.
 */
