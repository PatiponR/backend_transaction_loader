const io = require("socket.io-client");

const socket = io("http://localhost:5001");

console.log("Connecting to server...");

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("newTransaction", (data) => {
    console.log("Received new transaction:", data);
    // Exit after receiving one event for testing purposes
    process.exit(0);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

// Timeout after 10 seconds if no event received
setTimeout(() => {
    console.log("Timeout waiting for event");
    process.exit(1);
}, 10000);
