// Backend bot engine for WhatsApp, mirrors useBotEngine.js logic
const menu = require('./menu');
const branchInfo = require('./branchInfo');
const translations = require('./translations');
const { applyTypoCorrection } = require('./advancedNLP');
const { detectIntent } = require('./intentDetection');


// In-memory session store (for demo; use Redis/DB for production)
const sessions = {};
const INITIAL_STATE = {
    step: 'INIT',
    language: null, // 'en' or 'ar'
    currentCategory: null,
    currentItem: null,
    cart: [],
    itemOffset: 0,
    allCategoryItems: [],
    pendingIntents: [],
    currentIntent: null
};

function getSession(userId) {
    if (!sessions[userId]) sessions[userId] = JSON.parse(JSON.stringify(INITIAL_STATE));
    return sessions[userId];
}

function resetSession(userId) {
    sessions[userId] = JSON.parse(JSON.stringify(INITIAL_STATE));
}

// Step 1: Language detection and session state
function detectLanguageAndInitSession(userId, text) {
    const session = getSession(userId);
    if (!session.language) {
        const isArabic = /[\u0600-\u06FF]/.test(text);
        session.language = isArabic ? 'ar' : 'en';
    }
    return session.language;
}


function processMessage(userId, text) {
    const state = getSession(userId);

    // Step 1: Language detection
    let currentLang = detectLanguageAndInitSession(userId, text);
    const t = translations[currentLang];
    // Typo correction
    const standardizedInput = applyTypoCorrection(text, currentLang);
    const cleanText = standardizedInput.trim();

    // Step 6: NLP/intent handling (can trigger at any step)
    const detected = detectIntent(cleanText, currentLang);
    if (detected) {
        switch (detected.intent) {
            case 'show_menu': {
                state.step = 'CATEGORY_SELECTION';
                return t.choose_category + `\n- ${t.burgers_meals}\n- ${t.sandwiches_wraps}\n- ${t.snacks_sides}`;
            }
            case 'show_category': {
                const category = detected.category;
                let catText = '';
                if (category && [t.burgers_meals.toLowerCase(), t.sandwiches_wraps.toLowerCase(), t.snacks_sides.toLowerCase()].includes(category.toLowerCase())) {
                    state.step = 'AWAIT_CATEGORY';
                    catText = t.choose_category + `\n- ${t.burgers_meals}\n- ${t.sandwiches_wraps}\n- ${t.snacks_sides}`;
                } else {
                    catText = t.category_not_found || t.didnt_understand;
                }
                return catText;
            }
            case 'add_item': {
                const { item, quantity } = detected;
                // Try to find item in all categories
                let found = null, foundCat = null;
                for (const catId in menu.items) {
                    const match = (menu.items[catId] || []).find(i => i.name[currentLang].toLowerCase() === item?.toLowerCase());
                    if (match) { found = match; foundCat = catId; break; }
                }
                if (found) {
                    for (let i = 0; i < (quantity || 1); i++) state.cart.push(found);
                    state.step = 'ITEMS_LIST';
                    return `${t.added_to_cart} ${(quantity || 1)}x ${found.name[currentLang]} ${t.to_your_cart}`;
                }
                // Try advancedNLP for fuzzy item detection
                const nlpResult = require('./advancedNLP').advancedNLP(cleanText, currentLang);
                if (nlpResult && nlpResult.item) {
                    for (const catId in menu.items) {
                        const match = (menu.items[catId] || []).find(i => i.name[currentLang].toLowerCase() === nlpResult.item.toLowerCase());
                        if (match) {
                            for (let i = 0; i < (nlpResult.quantity || 1); i++) state.cart.push(match);
                            state.step = 'ITEMS_LIST';
                            return `${t.added_to_cart} ${(nlpResult.quantity || 1)}x ${match.name[currentLang]} ${t.to_your_cart}`;
                        }
                    }
                }
                return t.item_not_found || t.didnt_understand;
            }
            case 'remove_item': {
                const { item, quantity, all } = detected;
                let removedCount = 0;
                if (item) {
                    if (all) {
                        // Remove all instances
                        const before = state.cart.length;
                        state.cart = state.cart.filter(i => i.name[currentLang].toLowerCase() !== item.toLowerCase());
                        removedCount = before - state.cart.length;
                    } else if (quantity && quantity > 0) {
                        // Remove specific quantity
                        for (let i = 0; i < quantity; i++) {
                            let idx = state.cart.findIndex(i => i.name[currentLang].toLowerCase() === item.toLowerCase());
                            if (idx !== -1) { state.cart.splice(idx, 1); removedCount++; }
                        }
                    } else {
                        // Remove one
                        let idx = state.cart.findIndex(i => i.name[currentLang].toLowerCase() === item.toLowerCase());
                        if (idx !== -1) { state.cart.splice(idx, 1); removedCount = 1; }
                    }
                }
                if (removedCount > 0) {
                    return `${t.removed_from_cart} ${item} (${removedCount})`;
                }
                return t.item_not_in_cart || t.didnt_understand;
            }
            case 'payment': {
                if (!state.cart.length) return t.cart_empty;
                // Simulate payment intent
                let total = 0;
                const grouped = {};
                state.cart.forEach(item => {
                    const key = item.id + (item.preference ? `_${item.preference}` : '');
                    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
                    grouped[key].qty += 1;
                });
                Object.values(grouped).forEach(item => {
                    total += item.price * item.qty;
                });
                state.step = 'PAYMENT';
                return `${t.payment_instructions || 'Please proceed to payment.'}\n${t.total}: ${total} SAR`;
            }
            case 'show_cart': {
                if (!state.cart.length) return t.cart_empty;
                let summary = `${t.order_summary}\n`;
                let total = 0;
                const grouped = {};
                state.cart.forEach(item => {
                    const key = item.id + (item.preference ? `_${item.preference}` : '');
                    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
                    grouped[key].qty += 1;
                });
                Object.values(grouped).forEach((item, idx) => {
                    const name = item.name[currentLang];
                    const lineTotal = item.price * item.qty;
                    total += lineTotal;
                    summary += `${idx + 1}. ${name} x${item.qty} = ${lineTotal} SAR\n`;
                });
                summary += `${t.total}: ${total} SAR`;
                return summary;
            }
            case 'order_summary': {
                if (!state.cart.length) return t.cart_empty;
                let summary = `${t.order_summary}\n`;
                let total = 0;
                const grouped = {};
                state.cart.forEach(item => {
                    const key = item.id + (item.preference ? `_${item.preference}` : '');
                    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
                    grouped[key].qty += 1;
                });
                Object.values(grouped).forEach((item, idx) => {
                    const name = item.name[currentLang];
                    const lineTotal = item.price * item.qty;
                    total += lineTotal;
                    summary += `${idx + 1}. ${name} x${item.qty} = ${lineTotal} SAR\n`;
                });
                summary += `${t.total}: ${total} SAR\n${t.order_completed}`;
                resetSession(userId);
                return summary;
            }
            case 'cancel_order': {
                resetSession(userId);
                return t.cancel_success;
            }
            case 'greeting': {
                return t.welcome;
            }
            default:
                break;
        }
    }

    // Step 2: Welcome/init and initial menu/category flow
    if (state.step === 'INIT') {
        state.step = 'CATEGORY_SELECTION';
        // WhatsApp: show welcome, branches, and options as text
        let welcomeMsg = t.welcome + branchInfo.branches.map((b, i) => `${i + 1}. ${b.name}\n   ${b.phone}`).join('\n\n') + t.choose_option;
        welcomeMsg += `\n- ${t.order_text}\n- ${t.order_voice}`;
        return welcomeMsg;
    }

    // Step 3: Menu/category selection and navigation
    if (state.step === 'CATEGORY_SELECTION') {
        // Accept both button text and typed text
        const lower = cleanText.toLowerCase();
        if (lower === t.order_text.toLowerCase() || lower === t.order_voice.toLowerCase()) {
            // Show main categories
            let menuMsg = t.choose_category + '\n';
            menuMsg += `- ${t.burgers_meals}\n- ${t.sandwiches_wraps}\n- ${t.snacks_sides}`;
            state.step = 'AWAIT_CATEGORY';
            return menuMsg;
        }
        // If user types a category directly
        if ([t.burgers_meals.toLowerCase(), t.sandwiches_wraps.toLowerCase(), t.snacks_sides.toLowerCase()].includes(lower)) {
            state.step = 'AWAIT_CATEGORY';
            return t.choose_category + `\n- ${t.burgers_meals}\n- ${t.sandwiches_wraps}\n- ${t.snacks_sides}`;
        }
        // Prompt again if not recognized
        return t.choose_option + `\n- ${t.order_text}\n- ${t.order_voice}`;
    }

    if (state.step === 'AWAIT_CATEGORY') {
        const lower = cleanText.toLowerCase();
        let categoryIds = null;
        let title = '';
        if (lower === t.burgers_meals.toLowerCase()) {
            categoryIds = ['burgers', 'meals'];
            title = t.burgers_meals;
        } else if (lower === t.sandwiches_wraps.toLowerCase()) {
            categoryIds = ['sandwiches', 'wraps'];
            title = t.sandwiches_wraps;
        } else if (lower === t.snacks_sides.toLowerCase()) {
            categoryIds = ['sides', 'drinks', 'juices'];
            title = t.snacks_sides;
        }
        if (categoryIds) {
            // Gather all items in these categories
            let allItems = [];
            categoryIds.forEach(catId => {
                (menu.items[catId] || []).forEach(item => allItems.push({ ...item, catId }));
            });
            state.step = 'ITEMS_LIST';
            state.currentCategory = lower;
            state.itemOffset = 0;
            state.allCategoryItems = allItems;
            // Show first 2 items
            let msg = `${t.here_are} ${title}:\n`;
            allItems.slice(0, 2).forEach((item, idx) => {
                msg += `${idx + 1}. ${item.name[currentLang]} - ${item.price} SAR\n`;
            });
            if (allItems.length > 2) msg += t.more;
            return msg;
        }
        // Prompt again if not recognized
        return t.choose_category + `\n- ${t.burgers_meals}\n- ${t.sandwiches_wraps}\n- ${t.snacks_sides}`;
    }

    // Step 4: Item selection, quantity, and cart management
    if (state.step === 'ITEMS_LIST') {
        const idx = parseInt(cleanText) - 1;
        const items = state.allCategoryItems;
        if (!isNaN(idx) && items[idx]) {
            state.currentItem = items[idx];
            state.step = 'AWAIT_QTY';
            return `${t.how_many} ${items[idx].name[currentLang]}?`;
        }
        if (cleanText.toLowerCase() === t.more.toLowerCase()) {
            state.itemOffset += 2;
            const offset = state.itemOffset;
            let msg = '';
            items.slice(offset, offset + 2).forEach((item, i) => {
                msg += `${offset + i + 1}. ${item.name[currentLang]} - ${item.price} SAR\n`;
            });
            if (items.length > offset + 2) msg += t.more;
            return msg || t.didnt_understand;
        }
        return t.didnt_understand + '\n' + t.use_buttons;
    }

    if (state.step === 'AWAIT_QTY') {
        const qty = parseInt(cleanText);
        if (!isNaN(qty) && qty > 0) {
            const item = { ...state.currentItem };
            for (let i = 0; i < qty; i++) state.cart.push(item);
            state.step = 'ITEMS_LIST';
            return `${t.added_to_cart} ${qty}x ${item.name[currentLang]} ${t.to_your_cart}\nType a number to add another item, or type '${t.more}' to see more.`;
        }
        return t.type_qty_manual;
    }

    // Step 5: Order summary, finish/cancel, and advanced flows
    if (cleanText.toLowerCase() === t.finish_order.toLowerCase()) {
        if (!state.cart.length) return t.cart_empty;
        // Group and summarize cart
        let summary = `${t.order_summary}\n`;
        let total = 0;
        const grouped = {};
        state.cart.forEach(item => {
            const key = item.id + (item.preference ? `_${item.preference}` : '');
            if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
            grouped[key].qty += 1;
        });
        Object.values(grouped).forEach((item, idx) => {
            const name = item.name[currentLang];
            const lineTotal = item.price * item.qty;
            total += lineTotal;
            summary += `${idx + 1}. ${name} x${item.qty} = ${lineTotal} SAR\n`;
        });
        summary += `${t.total}: ${total} SAR\n${t.order_completed}`;
        // Reset session for new order
        resetSession(userId);
        return summary;
    }
    if (cleanText.toLowerCase() === t.cancel_order.toLowerCase()) {
        resetSession(userId);
        return t.cancel_success;
    }

    // Fallback
    return t.didnt_understand + '\n' + t.use_buttons;
}

module.exports = {
    processMessage,
    getSession,
    resetSession
};
