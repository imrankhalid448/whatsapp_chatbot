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

const TEST_USER = 'test_user_2';

console.log("Starting Refined Bot Simulation (Sequential Logic)...");

// 1. Initial greeting with "menu please" immediately
simulate(TEST_USER, "menu please");

// 2. Select "Burgers & Meals" (Button ID)
simulate(TEST_USER, "cat_burgers_meals");

// 3. Select "Chicken Burger" (Button ID)
simulate(TEST_USER, "item_1");

// 4. Manual quantity "2"
simulate(TEST_USER, "2");

// 5. Should have asked for Spicy/Regular - Select "Spicy"
simulate(TEST_USER, "spicy_yes");

// 6. Complex sequential NLP: "Add 1 beef burger and 3 water"
// Note: Beef burger might also prompt for preference if it's in burgers category
simulate(TEST_USER, "Add 1 beef burger and 3 water");

// 7. Handle preference for beef burger
simulate(TEST_USER, "spicy_no");

// 8. Typos and conjunctions: "and 2 Zingerrs"
simulate(TEST_USER, "and 2 Zingerrs");

// 9. Handle preference for Zinger
simulate(TEST_USER, "spicy_yes");

// 10. Finish order
simulate(TEST_USER, "finish_order");
