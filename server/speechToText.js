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

    // If we already have the correct model loaded, return it
    if (currentModel && currentLang === lang) {
        return currentModel;
    }

    // New language requested? Reset references
    if (currentModel) {
        console.log(`Switching language from ${currentLang} to ${lang}...`);
        // Note: vosk.Model doesn't have a .free() method in these bindings, 
        // it's managed by the garbage collector. Just nullify it.
        currentModel = null;
        if (global.gc) {
            console.log("Triggering manual garbage collection...");
            global.gc();
        }
    }

    const modelDir = path.join(__dirname, lang === 'ar' ? 'model-ar' : 'model-en');
    if (!fs.existsSync(modelDir)) {
        console.error(`Vosk model not found at ${modelDir}`);
        return null;
    }

    console.log(`Loading Vosk Model: ${lang} from ${modelDir}`);
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
        const model = initModel(lang || 'en');
        if (!model) return resolve(null);

        const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });
        let chunkCount = 0;

        // Convert OGG/Audio Buffer to PCM via FFmpeg
        const command = ffmpeg(Readable.from(audioBuffer))
            .audioFrequency(16000)
            .audioChannels(1)
            .format('s16le')
            .on('error', (err) => {
                console.error("FFmpeg error:", err);
                rec.free();
                reject(err);
            });

        const stream = command.pipe();

        stream.on('data', chunk => {
            chunkCount++;
            rec.acceptWaveform(chunk);
        });

        stream.on('end', () => {
            const result = rec.finalResult();
            rec.free();
            console.log(`Transcribed (${lang}): result="${result.text}", chunks=${chunkCount}`);
            resolve(result.text);
        });
    });
}

module.exports = { transcribeAudio };
