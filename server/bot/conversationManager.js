const MAX_HISTORY = 10;

const conversationManager = {
    /**
     * Store a message in the conversation history
     * @param {Object} state - User session state
     * @param {string} role - 'user' or 'bot'
     * @param {string} text - Message text
     * @param {Object} metadata - Additional context (intent, entities, sentiment)
     */
    addMessage: (state, role, text, metadata = {}) => {
        if (!state.history) state.history = [];

        state.history.push({
            role,
            text,
            timestamp: Date.now(),
            ...metadata
        });

        // Maintain history limit
        if (state.history.length > MAX_HISTORY) {
            state.history.shift();
        }
    },

    /**
     * Get the last recognized item from history
     * @param {Object} state 
     * @returns {Object|null} Last item context
     */
    getLastItemContext: (state) => {
        if (!state.history) return null;

        // Search backwards for the last time an item was added or discussed
        for (let i = state.history.length - 1; i >= 0; i--) {
            const entry = state.history[i];
            if (entry.context && entry.context.item) {
                return entry.context.item;
            }
        }
        return null;
    }
};

module.exports = conversationManager;
