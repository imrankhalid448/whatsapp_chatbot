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

    // (Next steps: implement full menu/category/item/cart/order logic)

    // Fallback
    return t.didnt_understand + '\n' + t.use_buttons;
}

module.exports = {
    processMessage,
    getSession,
    resetSession
};
