const menu = require('./menu');
const branchInfo = require('./branchInfo');
const translations = require('./translations');
const { advancedNLP, applyTypoCorrection } = require('./advancedNLP');
const { detectIntent } = require('./intentDetection');

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
    const now = Date.now();
    if (!sessions[userId]) {
        sessions[userId] = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    sessions[userId]._lastActive = now;
    return sessions[userId];
}

function resetSession(userId) {
    sessions[userId] = JSON.parse(JSON.stringify(INITIAL_STATE));
}

function processMessage(userId, text) {
    const state = getSession(userId);
    let currentLang = state.language;

    // 1. Language Detection & Initialization
    if (!currentLang) {
        const isArabic = /[\u0600-\u06FF]/.test(text);
        currentLang = isArabic ? 'ar' : 'en';
        state.language = currentLang;

        if (state.step === 'INIT') {
            const t = translations[currentLang];
            state.step = 'CATEGORY_SELECTION';
            return {
                type: 'button',
                body: t.welcome + branchInfo.branches.map((b, i) => `${i + 1}. ${b.name}\n   ${b.phone}`).join('\n\n') + t.choose_option,
                buttons: [
                    { id: 'order_text', title: t.order_text },
                    { id: 'order_voice', title: t.order_voice }
                ]
            };
        }
    }

    const t = translations[currentLang];
    const cleanText = text.trim();

    // ============================================
    // 1. BUTTON & COMMAND HANDLING (PRIORITY)
    // ============================================

    if (cleanText === 'order_text' || cleanText === 'order_voice') {
        state.step = 'CATEGORY_SELECTION';
        return {
            type: 'button',
            body: t.choose_category + '\n' + t.here_is_menu,
            buttons: [
                { id: 'cat_burgers_meals', title: t.burgers_meals },
                { id: 'cat_sandwiches_wraps', title: t.sandwiches_wraps },
                { id: 'cat_snacks_sides', title: t.snacks_sides }
            ]
        };
    }

    const normalizedText = cleanText.toLowerCase();
    if (normalizedText.startsWith('cat_')) {
        let categoryIds = [];
        let title = '';
        if (normalizedText === 'cat_burgers_meals') { categoryIds = ['burgers', 'meals']; title = t.burgers_meals; }
        else if (normalizedText === 'cat_sandwiches_wraps') { categoryIds = ['sandwiches', 'wraps']; title = t.sandwiches_wraps; }
        else if (normalizedText === 'cat_snacks_sides') { categoryIds = ['sides', 'drinks', 'juices']; title = t.snacks_sides; }

        if (categoryIds.length > 0) {
            let allItems = [];
            categoryIds.forEach(catId => { (menu.items[catId] || []).forEach(item => allItems.push({ ...item, catId })); });
            state.step = 'ITEMS_LIST';
            state.itemOffset = 0;
            state.allCategoryItems = allItems;
            return showItemsList(state, currentLang, t, title);
        }
    }

    if (cleanText === 'more_items') {
        state.itemOffset += 3;
        return showItemsList(state, currentLang, t);
    }

    if (cleanText.startsWith('item_')) {
        const itemId = cleanText.replace('item_', '');
        const selectedItem = state.allCategoryItems.find(item => item.id === itemId);
        if (selectedItem) {
            state.currentItem = selectedItem;
            state.step = 'AWAIT_QTY';
            return {
                type: 'button',
                body: `${t.how_many} ${selectedItem.name[currentLang]}?`,
                buttons: [
                    { id: 'qty_1', title: '1' },
                    { id: 'qty_2', title: '2' },
                    { id: 'more_qty', title: t.more }
                ]
            };
        }
    }

    if (cleanText.startsWith('qty_')) {
        if (cleanText === 'more_qty') {
            state.step = 'AWAIT_QTY_MANUAL';
            return t.type_qty_manual;
        }
        const qty = parseInt(cleanText.replace('qty_', ''));
        if (!isNaN(qty)) {
            return addItemsToCart(state, state.currentItem, qty, currentLang, t);
        }
    }

    if (state.step === 'AWAIT_QTY_MANUAL') {
        const qty = parseInt(cleanText);
        if (!isNaN(qty) && qty > 0) {
            return addItemsToCart(state, state.currentItem, qty, currentLang, t);
        }
    }

    if (cleanText === 'add_more') {
        state.step = 'CATEGORY_SELECTION';
        return {
            type: 'button',
            body: t.choose_category,
            buttons: [
                { id: 'cat_burgers_meals', title: t.burgers_meals },
                { id: 'cat_sandwiches_wraps', title: t.sandwiches_wraps },
                { id: 'cat_snacks_sides', title: t.snacks_sides }
            ]
        };
    }

    if (cleanText === 'finish_order') {
        return finalizeOrder(state, currentLang, t, userId);
    }

    // ============================================
    // 2. NATURAL LANGUAGE PROCESSING (FALLBACK)
    // ============================================

    const nlpIntents = advancedNLP(cleanText, currentLang);
    if (nlpIntents.length > 0) {
        return processSequentialIntents(state, nlpIntents, currentLang, t);
    }

    const explicitIntent = detectIntent(cleanText, currentLang);
    if (explicitIntent) {
        if (explicitIntent.intent === 'CANCEL_ORDER') {
            resetSession(userId);
            return t.cancel_success;
        }
        if (explicitIntent.intent === 'FINISH_ORDER') {
            return finalizeOrder(state, currentLang, t, userId);
        }
        if (explicitIntent.intent === 'BROWSE_ALL_CATEGORIES') {
            state.step = 'CATEGORY_SELECTION';
            return {
                type: 'button',
                body: t.here_is_menu,
                buttons: [
                    { id: 'cat_burgers_meals', title: t.burgers_meals },
                    { id: 'cat_sandwiches_wraps', title: t.sandwiches_wraps },
                    { id: 'cat_snacks_sides', title: t.snacks_sides }
                ]
            };
        }
        if (explicitIntent.intent === 'BROWSE_CATEGORY') {
            const catId = explicitIntent.categoryId;
            let categoryIds = [catId];
            if (catId === 'burgers' || catId === 'meals') categoryIds = ['burgers', 'meals'];
            else if (catId === 'sandwiches' || catId === 'wraps') categoryIds = ['sandwiches', 'wraps'];
            else if (['sides', 'drinks', 'juices'].includes(catId)) categoryIds = ['sides', 'drinks', 'juices'];

            let allItems = [];
            categoryIds.forEach(id => { (menu.items[id] || []).forEach(item => allItems.push({ ...item, catId: id })); });
            state.step = 'ITEMS_LIST';
            state.itemOffset = 0;
            state.allCategoryItems = allItems;
            return showItemsList(state, currentLang, t);
        }
    }

    return t.didnt_understand + ' ' + t.use_buttons;
}

function processSequentialIntents(state, intents, currentLang, t) {
    let messages = [];
    intents.forEach(intent => {
        if (intent.type === 'ITEM') {
            const item = intent.data;
            const qty = intent.qty || 1;
            const action = intent.action || 'ADD';
            const preference = intent.preference;

            if (action === 'REMOVE') {
                let removedCount = 0;
                for (let j = state.cart.length - 1; j >= 0; j--) {
                    const cartItem = state.cart[j];
                    if (cartItem.id === item.id && (!preference || cartItem.preference === preference)) {
                        state.cart.splice(j, 1);
                        removedCount++;
                        if (removedCount === qty) break;
                    }
                }
                if (removedCount > 0) {
                    messages.push(`${currentLang === 'ar' ? 'تم حذف' : 'Removed'} ${removedCount}x ${item.name[currentLang]}`);
                }
            } else {
                for (let i = 0; i < qty; i++) {
                    state.cart.push({ ...item, preference });
                }
                messages.push(`${t.added_to_cart} ${qty}x ${item.name[currentLang]} ${t.to_your_cart}`);
            }
        }
    });

    if (messages.length > 0) {
        let response = messages.join('\n') + '\n\n' + getShortCartSummary(state, currentLang, t);
        return {
            type: 'button',
            body: response + '\n' + t.add_more_prompt,
            buttons: [
                { id: 'add_more', title: t.add_more },
                { id: 'finish_order', title: t.finish_order }
            ]
        };
    }
    return t.didnt_understand;
}

function addItemsToCart(state, item, qty, currentLang, t) {
    for (let i = 0; i < qty; i++) state.cart.push({ ...item });
    state.step = 'ITEMS_LIST';
    let summary = `${t.added_to_cart} ${qty}x ${item.name[currentLang]} ${t.to_your_cart}\n\n`;
    summary += getShortCartSummary(state, currentLang, t);
    return {
        type: 'button',
        body: summary + '\n' + t.add_more_prompt,
        buttons: [
            { id: 'add_more', title: t.add_more },
            { id: 'finish_order', title: t.finish_order }
        ]
    };
}

function showItemsList(state, currentLang, t, title = '') {
    const items = state.allCategoryItems;
    const offset = state.itemOffset;
    const displayItems = items.slice(offset, offset + 3);
    const buttons = displayItems.map(item => ({ id: `item_${item.id}`, title: item.name[currentLang] }));
    if (items.length > offset + 3) buttons.push({ id: 'more_items', title: t.more });
    else buttons.push({ id: 'add_more', title: t.add_more });

    return {
        type: 'button',
        body: (title ? `${t.here_are} ${title}:\n` : '') + t.select_option,
        buttons
    };
}

function getShortCartSummary(state, currentLang, t) {
    const grouped = {};
    state.cart.forEach(item => {
        const key = item.id + (item.preference ? `_${item.preference}` : '');
        if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
        grouped[key].qty += 1;
    });
    let summary = `*${t.order_summary}*\n`;
    let total = 0;
    Object.values(grouped).forEach(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        summary += `• ${item.name[currentLang]} x${item.qty} = ${lineTotal} SAR\n`;
    });
    summary += `*${t.total}: ${total} SAR*`;
    return summary;
}

function finalizeOrder(state, currentLang, t, userId) {
    if (state.cart.length === 0) return t.cart_empty;
    const summary = getShortCartSummary(state, currentLang, t);
    resetSession(userId);
    return summary + '\n\n' + t.order_completed;
}

module.exports = {
    processMessage,
    getSession,
    resetSession
};
