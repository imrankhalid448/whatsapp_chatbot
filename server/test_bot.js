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
            // Validation
            const invalidButtons = reply.buttons.filter(b => b.title.length > 20);
            if (invalidButtons.length > 0) {
                console.error("FATAL ERROR: Buttons exceed 20 chars!", invalidButtons);
            }
        } else {
            console.log(`Bot (Text): ${reply}`);
        }
    }
}

const TEST_USER = 'test_user_wraps';

console.log("Starting Button Length Verification...");

// 1. Initial greeting
simulate(TEST_USER, "hi");

// 2. Select "Sandwiches & Wraps" (This category includes long names)
simulate(TEST_USER, "cat_sandwiches_wraps");

// 3. User selects "Wraps" intent via NLP to see items directly? 
// No, the buttons allow drilling down. Let's try direct category NLP: "Show me wraps"
simulate(TEST_USER, "show me wraps");

// 4. Verify the buttons for wraps.
// Expected: "Spicy Tortilla Zinger" -> "Spicy Tortilla Zinge" (20 chars)

// 5. Test "More" button functionality with long names
simulate(TEST_USER, "more_items");
