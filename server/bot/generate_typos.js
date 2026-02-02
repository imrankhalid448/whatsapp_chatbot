const fs = require('fs');
const path = require('path');
const menu = require('./menu');

const generateVariations = (word) => {
    const variations = new Set([word]);
    if (!word || word.length < 3) return Array.from(variations);

    // 1. Missing letters (one at a time)
    for (let i = 0; i < word.length; i++) {
        variations.add(word.slice(0, i) + word.slice(i + 1));
    }

    // 2. Swapped adjacent letters
    for (let i = 0; i < word.length - 1; i++) {
        variations.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
    }

    // 3. Repeated letters (double every letter)
    for (let i = 0; i < word.length; i++) {
        variations.add(word.slice(0, i) + word[i] + word[i] + word.slice(i + 1));
    }

    // 4. Vowel omission
    variations.add(word.replace(/[aeiou]/g, ''));

    // 5. Common Phonetic Swaps (English)
    const phoneticSwaps = { 'ph': 'f', 'f': 'ph', 'v': 'f', 'k': 'c', 'c': 'k', 's': 'z', 'z': 's' };
    Object.keys(phoneticSwaps).forEach(key => {
        if (word.includes(key)) {
            variations.add(word.replace(new RegExp(key, 'g'), phoneticSwaps[key]));
        }
    });

    // 6. Keyboard slips
    const keyboard = { 'q': 'w', 'w': 'e', 'e': 'r', 'r': 't', 't': 'y', 'a': 's', 's': 'd', 'd': 'f', 'f': 'g', 'g': 'h', 'z': 'x', 'x': 'c', 'c': 'v' };
    for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < word.length; j++) {
            if (keyboard[word[j]]) {
                variations.add(word.slice(0, j) + keyboard[word[j]] + word.slice(j + 1));
            }
        }
    }

    return Array.from(variations);
};

const generateArabicVariations = (word) => {
    const variations = new Set([word]);
    if (!word || word.length < 2) return Array.from(variations);

    // Deep Arabic Phonetic Swaps
    const swaps = {
        'ق': ['ك', 'غ', 'ق', 'أ'],
        'ك': ['ق', 'ك'],
        'ة': ['ه', 'ة'],
        'ه': ['ة', 'ه'],
        'أ': ['ا', 'إ', 'آ', 'ء'],
        'ا': ['أ', 'إ', 'آ'],
        'س': ['ص', 'س'],
        'ص': ['س', 'ص'],
        'ض': ['د', 'ظ', 'ض'],
        'ظ': ['ض', 'ز', 'ظ'],
        'ط': ['ت', 'ط'],
        'ت': ['ط', 'ت'],
        'ز': ['ذ', 'ظ', 'ز'],
        'ذ': ['ز', 'د', 'ذ']
    };

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (swaps[char]) {
            swaps[char].forEach(replacement => {
                variations.add(word.slice(0, i) + replacement + word.slice(i + 1));
            });
        }
    }

    // Double letters
    for (let i = 0; i < word.length; i++) {
        variations.add(word.slice(0, i) + word[i] + word[i] + word.slice(i + 1));
    }

    return Array.from(variations);
};

const main = () => {
    const dictionary = {};

    // Process Menu Items
    Object.values(menu.items).flat().forEach(item => {
        const enNames = [item.name.en.toLowerCase(), ...item.name.en.toLowerCase().split(' ')];
        const arNames = [item.name.ar, ...item.name.ar.split(' ')];

        enNames.forEach(name => {
            if (name.length < 3) return;
            generateVariations(name).forEach(v => {
                if (v.length > 2) dictionary[v] = item.name.en.toLowerCase();
            });
        });

        arNames.forEach(name => {
            if (name.length < 2) return;
            generateArabicVariations(name).forEach(v => {
                if (v.length > 1) dictionary[v] = item.name.ar;
            });
        });
    });

    // Process Categories
    menu.categories.forEach(cat => {
        const en = cat.title.en.toLowerCase();
        const ar = cat.title.ar;
        generateVariations(en).forEach(v => dictionary[v] = en);
        generateArabicVariations(ar).forEach(v => dictionary[v] = ar);
    });

    fs.writeFileSync(path.join(__dirname, 'mass_typos.json'), JSON.stringify(dictionary, null, 2));
    console.log(`Generated ${Object.keys(dictionary).length} typo variations.`);
};

main();
