const vosk = require('vosk');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const MODELS_CONFIG = {
    'en': { path: path.join(__dirname, 'model-en') },
    'ar': { path: path.join(__dirname, 'model-ar') }
};

const loadedModels = {};

function initModel(lang = 'en') {
    const config = MODELS_CONFIG[lang] || MODELS_CONFIG['en'];
    if (!fs.existsSync(config.path)) {
        console.error(`Vosk model not found at ${config.path}`);
        return null;
    }
    if (!loadedModels[lang]) {
        console.log(`Loading Vosk ${lang} model...`);
        vosk.setLogLevel(-1);
        loadedModels[lang] = new vosk.Model(config.path);
    }
    return loadedModels[lang];
}

function transcribeAudio(audioBuffer, lang = 'en') {
    return new Promise((resolve, reject) => {
        const model = initModel(lang);
        if (!model) return resolve(null);

        const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });

        const command = ffmpeg(Readable.from(audioBuffer))
            .audioFrequency(16000)
            .audioChannels(1)
            .format('s16le')
            .on('error', (err) => {
                console.error("FFmpeg error:", err);
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
