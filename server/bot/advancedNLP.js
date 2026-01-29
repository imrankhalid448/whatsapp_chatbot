const menu = require('./menu');

// ============================================
// COMPREHENSIVE TYPO CORRECTION DICTIONARY
// ============================================
const TYPO_CORRECTIONS = {
	'burger': 'burgers', 'burgers': 'burgers', 'brgr': 'burgers', 'brger': 'burgers',
	'beef': 'beef', 'chicken': 'chicken', 'zinger': 'zinger', 'zingerr': 'zinger',
	'coffee': 'coffee', 'water': 'water', 'watr': 'water', 'sicy': 'spicy', 'spicy': 'spicy',
	'sandwich': 'sandwiches', 'sandwiches': 'sandwiches', 'wraps': 'wraps', 'wrap': 'wraps', 'pepsi': 'pepsi',
	'regular': 'regular', 'normal': 'regular', 'non-spicy': 'non-spicy', 'nonspicy': 'non-spicy',
	'and': 'and', 'with': 'and', 'remove': 'remove', 'delete': 'remove',
	'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5'
};

const TYPO_CORRECTIONS_AR = {
	'برغر': 'برجر', 'دحاج': 'دجاج', 'لحمة': 'لحم', 'زنقر': 'زنجر',
	'حار': 'spicy', 'عادي': 'regular', 'بدون': 'regular',
	'واحد': '1', 'اثنين': '2', 'ثلاثة': '3'
};

const PREFERENCE_KEYWORDS = ['spicy', 'non-spicy', 'regular', 'normal', 'mild', 'hot'];

const applyTypoCorrection = (text, lang = 'en') => {
	let corrected = text.toLowerCase();
	const corrections = lang === 'ar' ? TYPO_CORRECTIONS_AR : TYPO_CORRECTIONS;

	// Add specific preference typos found in user logs
	if (lang !== 'ar') {
		corrected = corrected.replace(/\bsicy\b/g, 'spicy');
		corrected = corrected.replace(/\bsycy\b/g, 'spicy');
		corrected = corrected.replace(/\bnon spicy\b/g, 'non-spicy');
	}

	const words = corrected.split(/\s+/);
	const result = words.map(word => corrections[word] || word);
	return result.join(' ');
};

const levenshtein = (a, b) => {
	const matrix = [];
	for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
	for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
			else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
		}
	}
	return matrix[b.length][a.length];
};

const textToNumber = (text) => {
	const parsed = parseInt(text);
	if (!isNaN(parsed)) return parsed;
	const map = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
	return map[text.toLowerCase()] || null;
};

const buildItemIndex = () => {
	const index = [];
	Object.keys(menu.items).forEach(catId => {
		menu.items[catId].forEach(item => {
			const vars = [
				item.name.en.toLowerCase(),
				item.name.ar,
				...item.name.en.toLowerCase().split(' ')
			];
			index.push({ item: { ...item, catId }, variations: Array.from(new Set(vars)) });
		});
	});
	return index;
};

const buildCategoryIndex = () => {
	const index = [];
	menu.categories.forEach(cat => {
		const vars = [
			cat.id,
			cat.title.en.toLowerCase(),
			cat.title.ar,
			...cat.title.en.toLowerCase().split(' ')
		];
		index.push({ category: cat, variations: Array.from(new Set(vars)) });
	});
	return index;
};

const advancedNLP = (text, lang = 'en') => {
	try {
		const corrected = applyTypoCorrection(text, lang);
		const tokens = corrected.split(/\s+/).filter(t => t.length > 0);
		const itemIndex = buildItemIndex();
		const categoryIndex = buildCategoryIndex();
		const intents = [];

		let currentAction = 'ADD';
		let i = 0;

		while (i < tokens.length) {
			const token = tokens[i];
			if (token === 'and' || token === 'with' || token === ',' || token === '+') { i++; continue; }
			if (token === 'remove' || token === 'delete') { currentAction = 'REMOVE'; i++; continue; }
			if (token === 'add') { currentAction = 'ADD'; i++; continue; }

			const qty = textToNumber(token);
			const start = (qty !== null) ? i + 1 : i;
			let best = null;
			let bestType = null;
			let bestLen = 0;

			// Check for preference token first
			let preference = null;
			const pToken = (qty !== null) ? tokens[i + 1] : token;
			if (pToken && PREFERENCE_KEYWORDS.includes(pToken)) {
				preference = (pToken === 'regular' || pToken === 'normal' || pToken === 'mild') ? 'non-spicy' : pToken;
			}

			// Maximal match for Items OR Categories
			for (let len = 3; len >= 1; len--) {
				if (start + len > tokens.length) continue;
				const phrase = tokens.slice(start, start + len).join(' ');
				const lastToken = tokens[start + len - 1];
				const lastTokenIsNumber = textToNumber(lastToken) !== null;

				// Bypass if phrase is just a preference keyword
				if (PREFERENCE_KEYWORDS.includes(phrase)) continue;

				// Priority 1: Category Match
				for (const entry of categoryIndex) {
					for (const variation of entry.variations) {
						if (lastTokenIsNumber && !variation.includes(lastToken)) continue;
						if (variation === phrase || (phrase.length > 4 && variation.includes(phrase))) {
							if (len > bestLen) {
								best = entry.category;
								bestType = 'CATEGORY';
								bestLen = len;
							}
						}
					}
				}
				// If a category is found, we can prioritize it.
				// However, items might be longer and more specific.
				// Let's allow items to potentially override if they are a better match (longer phrase).

				for (const entry of itemIndex) {
					for (const variation of entry.variations) {
						if (variation.length < 3) continue;
						if (lastTokenIsNumber && !variation.includes(lastToken)) continue;
						const dist = levenshtein(phrase, variation);
						const threshold = variation.length > 5 ? 2 : 1;
						if (phrase === variation || dist <= threshold) {
							if (len > bestLen) { // Prefer item over category if same length? Usually yes.
								best = entry.item;
								bestType = 'ITEM';
								bestLen = len;
							}
						}
					}
				}
			}

			if (best || qty !== null || preference !== null) {
				// Heuristic: If we have a quantity but NO item/cat/pref match, and there is a next token,
				// it might be an unknown item (e.g., "9 pizza").
				if (!best && !preference && qty !== null && i + 1 < tokens.length) {
					const nextToken = tokens[i + 1];
					// Ensure next token isn't a skip word
					if (!['and', 'with', 'plus'].includes(nextToken)) {
						intents.push({
							type: 'UNKNOWN',
							data: nextToken,
							qty: qty
						});
						i += 2; // Consume qty and the unknown token
						continue;
					}
				}

				intents.push({
					type: bestType || 'ITEM', // If null, defaults to ITEM (context fallback)
					data: best, // If null, will trigger context fallback in engine.js
					qty: qty || 1,
					preference: preference,
					action: currentAction
				});
				i += (qty !== null ? 1 : 0) + (best ? bestLen : (preference ? 1 : 0));
			} else {
				i++;
			}
		}
		return intents;
	} catch (e) {
		console.error(e);
		return [];
	}
};

module.exports = { advancedNLP, applyTypoCorrection, textToNumber };
