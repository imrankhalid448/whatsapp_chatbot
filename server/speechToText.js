const vosk = require('vosk');
const fs = require('fs');
const { Readable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const path = require('path');

let currentModel = null;
let currentLang = null;

function initModel(lang = 'en') {
    const modelDir = lang === 'ar' ? 'model-ar' : 'model-en';

    // If we already have the correct model loaded, return it
    if (currentModel && currentLang === lang) {
        return currentModel;
    }

    // New language requested? Free the old one to save RAM
    if (currentModel) {
        console.log(`Switching language from ${currentLang} to ${lang}. Freeing old model...`);
        try {
            currentModel.free(); // Free C++ memory
        } catch (e) {
            console.error("Error freeing model:", e);
        }
        currentModel = null;
        global.gc && global.gc(); // Optional: Suggest JS GC
    }

    if (!fs.existsSync(modelDir)) {
        console.error(`Vosk model not found at ${modelDir}`);
        return null; // Fallback or Error
    }

    console.log(`Loading Vosk Model for language: ${lang} (${modelDir})...`);
    vosk.setLogLevel(-1);
    try {
        currentModel = new vosk.Model(modelDir);
        currentLang = lang;
        return currentModel;
    } catch (err) {
        console.error("Failed to load Vosk model:", err);
        return null;
    }
}

function transcribeAudio(audioBuffer, lang = 'en') {
    return new Promise((resolve, reject) => {
        const model = initModel(lang);
        if (!model) return resolve(null);

        const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });

        // Convert OGG/Audio Buffer to PCM via FFmpeg
        const command = ffmpeg(Readable.from(audioBuffer))
            .audioFrequency(16000)
            .audioChannels(1)
            .format('s16le') // Raw PCM 16-bit
            .on('error', (err) => {
                console.error("FFmpeg error:", err);
                rec.free();
                reject(err);
            });

        const stream = command.pipe();

        stream.on('data', chunk => {
            rec.acceptWaveform(chunk);
        });

        stream.on('end', () => {
            const result = rec.finalResult();
            rec.free();
            resolve(result.text);
        });
    });
}

module.exports = { transcribeAudio };
