
// Node.js compatible advancedNLP utility for backend bot
const menu = require('./menu');

const TYPO_CORRECTIONS = { /* ...full dictionary from frontend... */ };
const TYPO_CORRECTIONS_AR = { /* ...full dictionary from frontend... */ };

const applyTypoCorrection = (text, lang = 'en') => {
	let corrected = text.toLowerCase();
	const corrections = lang === 'ar' ? TYPO_CORRECTIONS_AR : TYPO_CORRECTIONS;
	const sortedKeys = Object.keys(corrections).sort((a, b) => b.length - a.length);
	sortedKeys.forEach(typo => {
		const correct = corrections[typo];
		const regex = new RegExp(`(^|\\s)${typo}($|\\s)`, 'gi');
		corrected = corrected.replace(regex, (match, p1, p2) => `${p1}${correct}${p2}`);
	});
	return corrected.trim();
};

const CATEGORY_ALIASES = { /* ...from frontend... */ };
const normalizeText = (text) => {
	if (!text) return '';
	return text.toLowerCase()
		.replace(/(.)\1{2,}/g, '$1')
		.replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
		.trim();
};

const levenshtein = (a, b) => {
	const matrix = [];
	for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
	for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1
				);
			}
		}
	}
	return matrix[b.length][a.length];
};

const textToNumber = (text) => {
	const numbers = {
		'one': 1, 'won': 1, 'on': 1, 'wall': 1,
		'two': 2, 'to': 2, 'too': 2, 'through': 2,
		'three': 3, 'tree': 3, 'free': 3, 'the': 3, 'they': 3,
		'four': 4, 'for': 4, 'floor': 4,
		'five': 5, 'hive': 5, 'fine': 5
		// ...extend as needed
	};
	return numbers[text.toLowerCase()] || parseInt(text, 10) || null;
};

// Export for backend use
module.exports = {
	applyTypoCorrection,
	normalizeText,
	levenshtein,
	textToNumber,
	CATEGORY_ALIASES
};
