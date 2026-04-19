/**
 * ==========================================
 * TOPIC 04: DATA TYPES & COERCION
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * JavaScript is dynamically typed, but it HAS types. 
 * Primitives: undefined, null, boolean, number, string, symbol, bigint. 
 * Objects: objects, arrays, functions, dates, etc.
 * 
 * - Memory Behavior (The Stack vs the Heap):
 *   - Stack: Fixed-size, LIFO, ultra-fast. Stores Primitives and Reference Pointers.
 *   - Heap: Dynamic size, slower. Stores the actual Objects/Arrays.
 * 
 * 2. INTERNAL WORKING (TYPE COERCION)
 * -----------------------------------
 * Implicit Coercion (Type Conversion) happens automatically. 
 * JavaScript uses the 'ToPrimitive' abstract operation for non-primitive conversions.
 * The order of preference:
 * 1. Symbol.toPrimitive(hint)
 * 2. valueOf()
 * 3. toString()
 * 
 * 3. EQUALITY LOGIC
 * -----------------
 * - Abstract Equality (==): Performs Type Coercion if types differ. 
 *   It follows the 'Abstract Equality Comparison Algorithm'.
 * - Strict Equality (===): No coercion. Compares both Type and Value.
 * - Object.is(): Handles edge cases like NaN === NaN (false) and 0 === -0 (true).
 * 
 * 4. VISUAL MENTAL MODEL: LABELS VS BOXES
 * ---------------------------------------
 * Think of Primitives as values written directly on a label. 
 * Think of Objects as a key to a locker (the box in the heap). 
 * When you copy a pointer, you're just giving someone else a copy of the key.
 * 
 * 5. EDGE CASES
 * -------------
 * - NaN: The only value in JS not equal to itself. (NaN === NaN is false).
 * - null vs undefined: 
 *   - null is an explicit "empty value" (intentional).
 *   - undefined is "not initialized yet" (implicit).
 * - typeof null: Returns "object" (Legacy bug that will never be fixed).
 */

// --- ONE BAD EXAMPLE: Relying on Implicit Coercion ---
function coercionMess() {
    console.log([] == ![]); // true (WAT?!)
    // Explanation: ![] is false (Boolean). [] == false becomes [].toString() == false.
    // "" == false becomes 0 == 0. True.

    if (10 == "10") {
        console.log("Avoid == if you don't know the types!");
    }
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
function seniorLogic() {
    // 1. Always use === for predictable logic
    const input = "100";
    if (Number(input) === 100) {
        console.log("Predictable explicit conversion.");
    }

    // 2. Use Object.is() for critical edge case comparisons (e.g. Finance/Math)
    if (Object.is(NaN, NaN)) {
        console.log("Correctly identified NaN.");
    }

    // 3. Proper null checks
    const val = null;
    if (val === null) {
        console.log("Explicitly checked for null.");
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between Primitive and Reference types?
 * A1: Primitives are immutable and stored on the stack. Reference types 
 *     (Objects) are mutable and stored on the heap; the variable only 
 *     holds the pointer to that memory address.
 * 
 * Q2: How does JS handle [] + []?
 * A2: Both arrays are coerced to strings via valueOf()/toString(). 
 *     Empty array toString() is "". So "" + "" = "".
 * 
 * Q3: What is the 'ToPrimitive' operation?
 * A3: It's an internal process that converts an object to a primitive value 
 *     when it's used in a context that requires a primitive (like math or string concatenation).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     console.log(1 < 2 < 3);
 *     console.log(3 > 2 > 1);
 * (Answer: true, then false. 
 *  1 < 2 is true. true < 3 becomes 1 < 3 (true). 
 *  3 > 2 is true. true > 1 becomes 1 > 1 (false).)
 * 
 * Q2: What is the output?
 *     console.log(typeof NaN);
 *     console.log(typeof (typeof 1));
 * (Answer: "number", "string". 
 *  NaN is a numeric type representing an illegal number. 
 *  'typeof 1' is "number" (a string), and 'typeof "number"' is "string".)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a robust 'isStrictEmpty' function that handles 
 *              null, undefined, "", [], and {} correctly using type checks.
 * Challenge 2: Debug an API response where numeric IDs are coming as strings 
 *              and breaking strict equality checks.
 */
