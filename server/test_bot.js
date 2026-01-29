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
            console.log(`Buttons: ${reply.buttons.map(b => `[${b.title} (ID: ${b.id})]`).join(', ')}`);
        } else {
            console.log(`Bot (Text): ${reply}`);
        }
    }
}

const TEST_USER = 'test_user_3';

console.log("Starting Mixed Preference Simulation (User Scenario)...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Select Burgers category
simulate(TEST_USER, "cat_burgers_meals");

// 3. Select Beef Burger
simulate(TEST_USER, "item_2");

// 4. Choose "More" for quantity
simulate(TEST_USER, "qty_more");

// 5. Type quantity "8"
simulate(TEST_USER, "8");

// 6. User specfic case: "4 sicy and 4 non spicy"
simulate(TEST_USER, "4 sicy and 4 non spicy");

// 7. Verify result and finish
simulate(TEST_USER, "finish_order");
