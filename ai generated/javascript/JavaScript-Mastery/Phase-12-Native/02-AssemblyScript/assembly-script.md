# Topic 02: AssemblyScript (Native speed with JS Syntax)

## 1. The Deep Dive: What is AssemblyScript?
AssemblyScript (AS) is a language that is syntactically a subset of TypeScript but is compiled directly to **WebAssembly (Wasm)**. Unlike TypeScript which transpiles to JavaScript, AS targets the binary instruction set of Wasm.

- **Speed**: AS executes at near-native speeds because it avoids the overhead of V8's garbage collection and dynamic type checking.
- **Syntax**: If you know TypeScript, you already know 90% of AssemblyScript.

## 2. Key Differences from TypeScript
While it *looks* like TS, it behaves like a low-level language:
1. **Strict Types**: You must use specific integer and float types (`i32`, `f64`, `u8`) instead of just `number`.
2. **No 'any' or 'undefined'**: Every value must have a precise, fixed type at compile time.
3. **Manual Memory**: While it has a managed heap, you often interact with **Linear Memory** directly for performance.

## 3. Internal Working (The Toolchain)
1. **Source**: You write `.ts` files.
2. **Compiler (`asc`)**: The AssemblyScript compiler parses the code, performs static analysis, and generates binary `.wasm`.
3. **Glue Code**: AS generates a small JS "loader" that handles the instantiation and memory bridge.

## 4. Visual Mental Model: The Formula 1 Car
- **JavaScript**: A high-performance luxury car (Safe, automated, very fast).
- **TypeScript**: The luxury car with a detailed dashboard (Safety checks).
- **AssemblyScript**: A Formula 1 car. It has a similar steering wheel (Syntax), but it's built purely for speed. It has no air conditioning (Browser APIs) or airbags (Dynamic checks). You have to handle the controls manually.

---

## 5. Code Example: Heavy Math Comparison

### AssemblyScript (Source)
```typescript
// assembly/index.ts
export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### JavaScript (Loading)
```javascript
// index.js
import { fibonacci } from "./build/release.js";

const start = performance.now();
console.log("Wasm Result:", fibonacci(40));
console.log(`Wasm Time: ${performance.now() - start}ms`);
```

---

## 6. Pitfalls & Performance
- **Strings/Objects**: Passing strings between JS and Wasm is expensive! You have to encode them into bytes and copy them into the Wasm memory.
- **Recursion**: Wasm has a limited stack. Extremely deep recursion can cause a "Stack Overflow" more easily than in JS.

## 7. Interview Questions (Q&A)
**Q: Why use AssemblyScript instead of Rust or C++ for Wasm?**
**A**: Productivity. Web developers can leverage their existing knowledge of TypeScript syntax and the NPM ecosystem while achieving significant performance gains.

**Q: Can you use browser globals like `document` in AssemblyScript?**
**A**: No. Wasm is isolated. You must pass a JS function (Import) to the AS module if you want it to trigger a UI update.

## 8. Real-world Challenge
1. **Challenge**: Take our "Deep Clone" logic from Phase 3 and try to implement it in AssemblyScript. (Hint: You'll need to handle the recursive pointer map in linear memory).
2. **Challenge**: Build an image brightness filter in AS and compare the FPS against a pure JS Canvas implementation.
