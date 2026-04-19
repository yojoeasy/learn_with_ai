# Topic 03: Node.js C++ Addons (N-API)

## 1. The Deep Dive: What is a Native Addon?
A Node.js Addon is a dynamically-linked shared object (`.node` file) that glue C++ code to the V8 engine and Node.js environment. 

### Why not just use JS?
- **Extreme Performance**: Low-level math, cryptographic hashing, or video encoding.
- **Hardware Access**: Interfacing with custom drivers or OS-level APIs that Node doesn't expose.
- **Legacy Integration**: Wrapping existing massive C++ libraries into a JS interface.

## 2. N-API (Node-API) vs Legacy Nan
Historically, addons broke whenever V8 was updated. **N-API** solves this by providing **ABI (Application Binary Interface) Stability**.
- **ABI Stability**: You can compile your addon once, and it will work across different Node.js versions without recompilation.

## 3. Internal Working (The Bridge)
1. **Wrappers**: C++ code uses N-API headers to define JS-callable functions.
2. **Arguments**: N-API provides tools to convert `napi_value` (JS objects) into C++ types (int, string, bool) and back.
3. **Threading**: Native addons can spawn their own threads via the libuv thread pool or raw C++ threads, bypassing the single-threaded nature of the JS main thread.

## 4. Visual Mental Model: The Translator Cabinet
- **Node.js (JS)**: An English-speaking office.
- **Addon (C++)**: A Mandarin-speaking machine room.
- **N-API**: A neutral translation cabinet in the wall. You put a message in an N-API envelope, slide it through, and the C++ side reads it, processes it, and slides a result envelope back. No matter how the office or the machine room gets remodeled (version updates), the envelope size and the cabinet slots (N-API) stay exactly the same.

---

## 5. Code Example: Conceptual Addon

### C++ Source (hello.cpp)
```cpp
#include <node_api.h>

napi_value Hello(napi_env env, napi_callback_info info) {
    napi_value result;
    napi_create_string_utf8(env, "Hello from C++", NAPI_AUTO_LENGTH, &result);
    return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc = { "sayHello", 0, Hello, 0, 0, 0, napi_default, 0 };
    napi_define_properties(env, exports, 1, &desc);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

### JS Usage
```javascript
const addon = require('./build/Release/hello.node');
console.log(addon.sayHello()); // "Hello from C++"
```

---

## 6. Wasm vs C++ Addons
- **Wasm**: Secure (sandboxed), portable (works in browser + node), but slightly slower execution than native and limited system access.
- **Addons**: Full system access, zero sandboxing (can crash the process), restricted to Node.js backend.

## 7. Interview Questions (Q&A)
**Q: When is a C++ addon overkill?**
**A**: When the bottleneck is I/O (Database, Network). Node.js is already world-class at I/O. Reach for C++ only when the **CPU** is the bottleneck.

**Q: What is a "Thread-safe Function" in N-API?**
**A**: It's an N-API utility that allows a background C++ thread to safely schedule a call to a JS function back on the main thread's event loop.

## 8. Real-world Challenge
1. **Research**: Look at the source code of a popular library like `bcrypt` or `sqlite3`. Identify where they use `napi_` calls to coordinate between JS and C++.
2. **Challenge**: Describe how you would build a high-performance image processing pipeline that uses Workers (Phase 11) for concurrency and a C++ Addon for the actual pixel manipulation.
