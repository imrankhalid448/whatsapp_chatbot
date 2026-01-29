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

const TEST_USER = 'test_user_cancel_flow_fixed';

console.log("Starting Cancel Order Flow Simulation (Fixed IDs)...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Add some items
simulate(TEST_USER, "3 coffee"); // ID 43
simulate(TEST_USER, "2 beef burger non spicy"); // ID 2

// 3. Request Cancel
simulate(TEST_USER, "cancel order");

// 4. Select "Cancel Specific Item"
// EXPECTED:
// - List of items to remove: [Coffee (3)], [Beef Burger (2)]
simulate(TEST_USER, "cancel_item");

// 5. Select Coffee to remove (Correct ID: 43)
// EXPECTED:
// - "How many Coffee would you like to remove?"
// - Buttons: [1], [2], [All]
simulate(TEST_USER, "remove_item_group_43");

// 6. Remove 1
// EXPECTED:
// - Removed 1x Coffee
// - Order Summary shown
simulate(TEST_USER, "qty_remove_1");
