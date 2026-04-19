// Practice file for Error Handling

function divideNumbers(a, b) {
    if (b === 0) {
        // We MANUALLY throw an explosion if someone tries to divide by zero!
        throw new Error("Cannot divide by zero! The universe will collapse!");
    }
    return a / b;
}

try {
    console.log("Trying safe division:", divideNumbers(10, 2)); // 5

    console.log("Trying risky division...");
    console.log(divideNumbers(10, 0)); // 🛑 This throws the error!

    console.log("This line NEVER runs because the error blew up the 'try' block.");
} catch (error) {
    // We catch the explosion here!
    console.log("💥 CAUGHT AN ERROR:", error.message);
} finally {
    console.log("Execution finished! Cleaning up...");
}

console.log("App didn't crash! It kept running!");
