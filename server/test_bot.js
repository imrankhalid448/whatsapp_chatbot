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

const TEST_USER_EN = 'test_user_payment_en';
const TEST_USER_AR = 'test_user_payment_ar';

console.log("Starting Payment Flow Simulation...");

// Case 1: English - Online Payment
simulate(TEST_USER_EN, "hi");
simulate(TEST_USER_EN, "2 coffee");
simulate(TEST_USER_EN, "finish_order"); // Should show payment options
// EXPECTED:
// - Order Summary
// - Choose payment method: [Cash], [Online]
simulate(TEST_USER_EN, "pay_online");
// EXPECTED:
// - Order Confirmed
// - Payment Method: Online Payment
// - Payment Link: https://...

// Case 2: Arabic - Cash Payment
simulate(TEST_USER_AR, "أهلاً");
simulate(TEST_USER_AR, "٢ برجر دجاج"); // 2 Chicken Burger
simulate(TEST_USER_AR, "عادي"); // Non-spicy
simulate(TEST_USER_AR, "إنهاء الطلب"); // finish_order (Arabic)
// EXPECTED:
// - ملخص الطلب
// - اختر طريقة الدفع: [نقدي], [دفع أونلاين]
simulate(TEST_USER_AR, "pay_cash"); // Button ID is English 'pay_cash'
// EXPECTED:
// - تم تأكيد الطلب
// - طريقة الدفع: الدفع نقداً عند الاستلام
