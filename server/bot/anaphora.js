const anaphora = {
    /**
     * Resolve pronouns to specific items in history
     * @param {string} text - User input
     * @param {Object} lastItem - The last active item context
     * @param {string} lang - Language code ('en' or 'ar')
     * @returns {Object|null} Resolved reference or null
     */
    resolveReference: (text, lastItem, lang = 'en') => {
        if (!lastItem) return null;

        const lower = text.toLowerCase();

        const SINGULAR_PRONOUNS = {
            en: ['it', 'this', 'that', 'the first one', 'the item'],
            ar: ['هذا', 'هذه', 'اياه', 'هو', 'هي', 'الاول']
        };

        const PLURAL_PRONOUNS = {
            en: ['them', 'those', 'these', 'all of them'],
            ar: ['هم', 'هؤلاء', 'الكل', 'جميعهم']
        };

        const pronouns = [...SINGULAR_PRONOUNS[lang], ...PLURAL_PRONOUNS[lang]];

        // Arabic suffix checking (e.g., 'حذفه' -> delete IT)
        if (lang === 'ar') {
            const suffixes = ['ه', 'ها', 'هم'];
            const tokens = lower.split(' ');
            for (const token of tokens) {
                for (const suffix of suffixes) {
                    if (token.endsWith(suffix) && token.length > suffix.length + 2) {
                        // Simple heuristic: if word ends in suffix and is long enough
                        return { target: lastItem, type: 'suffix_resolved' };
                    }
                }
            }
        }

        // Direct matching
        if (pronouns.some(p => lower.includes(p))) {
            return { target: lastItem, type: 'direct_match' };
        }

        return null;
    },

    /**
     * Check if input is a quantity adjustment for the last item
     * @param {string} text 
     * @returns {number|null} New quantity or null
     */
    extractContextualQuantity: (text, lang) => {
        // En: "Make it 5", "Change to 3", "Actually 2"
        // Ar: "خليهم ٥", "بدل الى ٣", "لا ٢"

        const numMatch = text.match(/\d+/);
        if (!numMatch) return null;

        const qty = parseInt(numMatch[0]);
        if (isNaN(qty)) return null;

        const TRIGGERS = {
            en: ['make it', 'change to', 'actually', 'no', 'make them', 'i want'],
            ar: ['خليهم', 'خليها', 'بدل', 'تغيير', 'لا', 'اريد', 'ابغى']
        };

        if (TRIGGERS[lang].some(t => text.toLowerCase().includes(t))) {
            return qty;
        }

        return null; // Just a number might not be an adjustment
    }
};

module.exports = anaphora;
