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

const TEST_USER = 'test_user_mixed_qty';

console.log("Starting '8 Coffee 4 Drinks' Fix Simulation...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Select Burgers & Meals (just to get started)
simulate(TEST_USER, "cat_burgers_meals");

// 3. User types complex mixed command
// EXPECTED:
// - Added 8x Coffee
// - Thank you for ordering 4 Drinks... (NOT 1)
simulate(TEST_USER, "8 coffee 4 drinks");

// 4. Verify the drinks flow follows up
simulate(TEST_USER, "3 pepsi and 1 water");
