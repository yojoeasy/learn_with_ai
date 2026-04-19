// Practice file for Performance

// Creating a memory leak (DON'T RUN THIS ON PRODUCTION!)
let cacheThatNeverEmpties = [];

function dangerousFunction() {
    // If this function runs 1,000 times, the array gets massive and never clears.
    let massiveDataChunk = new Array(100000).fill("Leaking Memory...");
    cacheThatNeverEmpties.push(massiveDataChunk);
}

// dangerousFunction(); // Uncomment to start leaking!

// Performance Test
console.time("Slow Loop");
let total = 0;
for (let i = 0; i < 1_000_000_00; i++) {
    total += i; // A very heavy math loop
}
console.timeEnd("Slow Loop"); // Prints exactly how many milliseconds the loop took to run!

console.log("Memory & Performance Demo finished.");
