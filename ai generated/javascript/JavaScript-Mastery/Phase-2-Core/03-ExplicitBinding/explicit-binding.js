/**
 * ==========================================
 * TOPIC 03: call(), apply(), and bind()
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * These three methods are part of the 'Function.prototype' and allow 
 * developers to EXPLICITLY set the 'this' context for a function call.
 * 
 * - call(): Invokes the function immediately with arguments passed 
 *   one-by-one (Comma-separated).
 * - apply(): Invokes the function immediately with arguments passed 
 *   as an Array.
 * - bind(): Does NOT invoke the function immediately. Instead, it 
 *   returns a NEW function with the 'this' context baked in.
 * 
 * 2. INTERNAL WORKING (POLYFILL LOGIC)
 * -------------------------------------
 * Under the hood, call/apply/bind use the 'Reflect.apply' or internal engine 
 * mechanisms to switch the 'this' binding for the execution context being pushed 
 * onto the call stack.
 * 
 * 3. REAL-WORLD USAGE: METHOD BORROWING
 * --------------------------------------
 * Method borrowing is the practice of using a method from one object 
 * on another object that doesn't own that method. 
 * Example: `Array.prototype.slice.call(arguments)` to convert array-like 
 * objects into real arrays (Legacy approach).
 * 
 * 4. VISUAL MENTAL MODEL: THE REMOTE CONTROL
 * ------------------------------------------
 * Think of the function as a "TV". Usually, it has its own power source (Implicit this). 
 * - call/apply are like plugging the TV into a specific "Power Socket" (Object). 
 * - bind is like creating a "Pre-programmed Remote" that always points 
 *   at that one specific socket, no matter where you take the TV later.
 * 
 * 5. EDGE CASES
 * -------------
 * - Passing null/undefined: In non-strict mode, 'this' defaults to the 
 *   global object. In strict mode, 'this' becomes null/undefined.
 * - Function arguments limit: Passing too many arguments via apply() 
 *   can actually blow the call stack limit in some engines (though rare 
 *   with modern memory).
 */

// --- ONE BAD EXAMPLE: Using apply for non-array tasks ---
const player = { name: "Champion" };
function getScore(p1, p2) {
    console.log(`${this.name} score: ${p1 + p2}`);
}

// BAD: Misusing apply when simple call is cleaner
// getScore.apply(player, 10, 20); // TypeError: Second arg must be array

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

const flight = {
    airline: "AirJS",
    iataCode: "JS",
    bookings: [],
    book(flightNum, name) {
        console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`);
        this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
    }
};

const flight2 = {
    airline: "EuroStack",
    iataCode: "ES",
    bookings: []
};

// 1. Using CALL (Comma separated)
flight.book.call(flight2, 23, "Sarah");

// 2. Using APPLY (Array of arguments) - useful when data comes as array
const data = [55, "Peter"];
flight.book.apply(flight2, data);

// 3. Using BIND (Create new function) - perfect for event handlers/callbacks
const bookES = flight.book.bind(flight2);
bookES(101, "Jane");

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the main difference between call and apply?
 * A1: The syntax for passing arguments. call expects comma-separated values, 
 *     apply expects an array.
 * 
 * Q2: Can you use bind twice?
 * A2: No. Once a function is bound, its 'this' context is locked and 
 *     cannot be changed by further bind/call/apply calls.
 * 
 * Q3: Why is bind useful in React class components?
 * A3: To ensure event handler methods maintain access to 'this.state' 
 *     when passed as callbacks to child components.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     function print() { console.log(this.x); }
 *     const obj = { x: 1 };
 *     const obj2 = { x: 2 };
 *     const bound = print.bind(obj).bind(obj2); 
 *     bound();
 * (Answer: 1. You cannot re-bind a bound function.)
 * 
 * Q2: What is the output?
 *     const numbers = [5, 6, 2, 3, 7];
 *     const max = Math.max.apply(null, numbers);
 *     console.log(max);
 * (Answer: 7. apply() spreads the array into arguments for Math.max.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a function utility 'logWithDate' that binds a 
 *              specific prefix and date string to a console.log function.
 * Challenge 2: Borrow the 'Array.prototype.join' method to join an object 
 *              that has numeric keys and a length property.
 */
