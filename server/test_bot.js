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

const TEST_USER = 'test_user_intent_preservation';

console.log("Starting Intent Preservation Verification...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Complex command: Category -> Category -> Unknown
// "5 drinks" (Should pause for selection)
// "23 wraps" (Should be preserved in pending)
// "9 pizza" (Should be preserved in pending, then rejected)
simulate(TEST_USER, "5 drinks 23 wraps and 9 pizza");

// 3. User selects "Water" in response to "Which drink?"
// EXPECTED:
// - Added 5x Water
// - [RESUME PENDING]: Processing "23 Wraps" -> Prompt "Which wrap?"
// - [RESUME PENDING]: Processing "9 Pizza" -> Error "Sorry, pizza not on menu" (after wrap selection? No, wrap pauses too).
simulate(TEST_USER, "Water");

// 4. If prompt is for Wraps, select "Regular Tortilla Zinger"
// EXPECTED:
// - Added 23x Regular Tortilla Zinger
// - [RESUME PENDING]: Processing "9 Pizza" -> Error "Sorry, pizza not on menu"
simulate(TEST_USER, "item_7"); 
