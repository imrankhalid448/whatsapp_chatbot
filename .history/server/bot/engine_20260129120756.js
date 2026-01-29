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

    // Fallback
    return t.didnt_understand + '\n' + t.use_buttons;
}

module.exports = {
    processMessage,
    getSession,
    resetSession
};
