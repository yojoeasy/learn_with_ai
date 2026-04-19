// Practice file for Async JS

console.log("1. Application started!");

// Simulating a delayed network request with a Promise
function fakeNetworkCall() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: "Secret Database Info" });
        }, 1500);
    });
}

// Modern async/await syntax
async function loadData() {
    console.log("3. Fetching data in background...");

    try {
        const result = await fakeNetworkCall();
        console.log("4. Data arrived! ->", result.data);
    } catch (error) {
        console.log("Error loading data:", error);
    }
}

loadData();

console.log("2. Moving on while the network call happens...");
