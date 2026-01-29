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

const TEST_USER = 'test_user_drinks_fix';

console.log("Starting '8 Drinks' Fix Simulation...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Select Burgers
simulate(TEST_USER, "cat_burgers_meals");

// 3. Select Chicken Burger
simulate(TEST_USER, "item_1");

// 4. Quantity 4
simulate(TEST_USER, "4");

// 5. Preferences
simulate(TEST_USER, "2 spicy and 2 non spicy");

// --- Order Summary Shown, currentItem should be cleared ---

// 6. User says "8 drinks" (The bug trigger)
// Should NOT say "How would you like your Chicken Burger?"
// Should verify "drinks" is detected as category and logic flows to simple browsing/listing.
simulate(TEST_USER, "8 drinks");
