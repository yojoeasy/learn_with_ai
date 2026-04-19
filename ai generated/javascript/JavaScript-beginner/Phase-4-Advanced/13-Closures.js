// Practice file for Closures
function makeCounter() {
    // This variable is protected
    let count = 0;

    // We return an object with methods that have a Closure over 'count'
    return {
        increment: function () {
            count++;
            console.log("Count is now:", count);
        },
        getCount: function () {
            return count;
        }
    };
}

const myCounter = makeCounter();

myCounter.increment(); // 1
myCounter.increment(); // 2

// Try to access count directly...
console.log("Direct access to count:", myCounter.count); // undefined! Data privacy works!
console.log("Safe access via method:", myCounter.getCount()); // 2
