const engine = require('./bot/engine');

function simulate(userId, text) {
    console.log(`\n--- [User: ${userId}] Message: "${text}" ---`);
    const replies = engine.processMessage(userId, text);
    if (!Array.isArray(replies)) {
        console.log("Error: Bot engine MUST return an array of messages.");
        return;
    }
    for (const reply of replies) {
        if (typeof reply === 'object' && reply.type === 'button') {
            console.log(`Bot (Button): ${reply.body}`);
            console.log(`Buttons: ${reply.buttons.map(b => `[${b.title} (Len: ${b.title.length})]`).join(', ')}`);
        } else {
            console.log(`Bot (Text): ${reply}`);
        }
    }
}

const TEST_USER = 'test_user_payment_refinement';

console.log("Starting Payment refinement Simulation...");

// 1. Initial greeting
simulate(TEST_USER, "hi");
simulate(TEST_USER, "2 coffee");

// 2. Finish Order (NLP Intent)
// EXPECTED:
// - Order Summary
// - Choose payment method: [Cash], [Online Payment], [Cancel Order]
simulate(TEST_USER, "finish order");

// 3. Select "Cancel Order" from Payment Menu
// EXPECTED:
// - Manage Order Options: [Cancel Complete Order], [Cancel Specific Item], [Go Back]
simulate(TEST_USER, "cancel_order");

// 4. Cancel All
// EXPECTED:
// - Cancel success message
simulate(TEST_USER, "cancel_all");
