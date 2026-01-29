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
    language: null,
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

function processMessage(userId, text) {
    const state = getSession(userId);
    // Language detection
    let currentLang = state.language;
    if (!currentLang) {
        const isArabic = /[\u0600-\u06FF]/.test(text);
        currentLang = isArabic ? 'ar' : 'en';
        state.language = currentLang;
    }
    const t = translations[currentLang];
    // Typo correction
    const standardizedInput = applyTypoCorrection(text, currentLang);
    const cleanText = standardizedInput.trim();
    // Welcome/init
    if (state.step === 'INIT') {
        state.step = 'CATEGORY_SELECTION';
        return t.welcome + branchInfo.branches.map((b, i) => `${i + 1}. ${b.name}\n   ${b.phone}`).join('\n\n') + t.choose_option;
    }
    // Intent detection (stub)
    const explicitIntent = detectIntent(cleanText, currentLang);
    if (explicitIntent && explicitIntent.intent === 'BROWSE_ALL_CATEGORIES') {
        return t.here_is_menu;
    }
    // Fallback
    return t.didnt_understand + '\n' + t.use_buttons;
}

module.exports = {
    processMessage,
    getSession,
    resetSession
};
