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

const TEST_USER = 'test_user_plural_fix';

console.log("Starting Singular/Plural Category Fix Simulation...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. User orders "wraps" (previously rejected as unknown "wrap")
// EXPECTED:
// - Prompt for Wraps category "Please select which wrap..."
// - NOT "Sorry, wrap is not on our menu"
simulate(TEST_USER, "44 wraps and 33 snacks");

// 3. User says "sandwich" (Singular)
// EXPECTED:
// - Prompt for Sandwiches category (Mapped to 'sandwiches')
simulate(TEST_USER, "1 sandwich");
