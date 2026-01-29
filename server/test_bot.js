const engine = require('./bot/engine');

function simulate(userId, text) {
    console.log(`\n--- [User: ${userId}] Message: "${text}" ---`);
    const reply = engine.processMessage(userId, text);
    if (typeof reply === 'object' && reply.type === 'button') {
        console.log(`Bot (Button): ${reply.body}`);
        console.log(`Buttons: ${reply.buttons.map(b => `[${b.title} (ID: ${b.id})]`).join(', ')}`);
    } else {
        console.log(`Bot (Text): ${reply}`);
    }
}

const TEST_USER = 'test_user_1';

console.log("Starting Bot Simulation...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Click "Order via Text" (Button ID)
simulate(TEST_USER, "order_text");

// 3. Click "Burgers & Meals" (Button ID)
simulate(TEST_USER, "cat_burgers_meals");

// 4. Click "Chicken Burger" (Button ID)
simulate(TEST_USER, "item_1");

// 5. Click "Qty 2" (Button ID)
simulate(TEST_USER, "qty_2");

// 6. Free text addition: "add 3 beef burgers" (NLP)
simulate(TEST_USER, "add 3 beef burgers");

// 7. Free text addition with typo: "and 2 Zingerr" (NLP)
simulate(TEST_USER, "and 2 Zingerr");

// 8. Intent detection: "show me the menu"
simulate(TEST_USER, "show me the menu");

// 9. Click "Snacks & Sides"
simulate(TEST_USER, "cat_snacks_sides");

// 10. Finish order
simulate(TEST_USER, "finish_order");
