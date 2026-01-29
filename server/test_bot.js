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

const TEST_USER = 'test_user_arabic_switch';

console.log("Starting Arabic Language Switch Simulation...");

// 1. Start in English
simulate(TEST_USER, "hi");

// 2. Switch to Arabic with greeting
// EXPECTED:
// - Switch language to 'ar'
// - Show Main Menu in Arabic
simulate(TEST_USER, "أهلاً");

// 3. Order in Arabic
// EXPECTED:
// - Understand Arabic numbers and items
simulate(TEST_USER, "١ برجر دجاج"); 
