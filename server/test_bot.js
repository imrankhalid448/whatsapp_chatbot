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

const TEST_USER = 'test_user_arabic_nlp_fix';

console.log("Starting Arabic NLP Parity Simulation...");

// 1. Initial greeting (Arabic)
simulate(TEST_USER, "أهلاً");

// 2. Complex Arabic Order (The failing case)
// EXPECTED:
// - 9x Burger (Beef Burger, prompts for spicy)
// - 9x Wraps (Prompts for Selection)
// - 9x Coffee (Added immediately)
simulate(TEST_USER, "9 برغر و9 لفائف و9 قهوة");

// 3. Selection for Wraps
// EXPECTED:
// - Adds 9x Spicy Zinger Wraps (since qty 9 was carried over)
simulate(TEST_USER, "تورتيلا زنجر حار");

// 4. Selection for Burger (if prompted)
// EXPECTED:
// - Adds 9x Beef Burger (Spicy/Non-Spicy)
simulate(TEST_USER, "حار"); 
