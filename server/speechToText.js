const vosk = require('vosk');
const fs = require('fs');
const { Readable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const MODEL_PATH = 'model';

let model = null;

function initModel() {
    if (!fs.existsSync(MODEL_PATH)) {
        console.error("Vosk model not found at " + MODEL_PATH);
        return null;
    }
    if (!model) {
        vosk.setLogLevel(-1);
        model = new vosk.Model(MODEL_PATH);
    }
    return model;
}

function transcribeAudio(audioBuffer) {
    return new Promise((resolve, reject) => {
        const model = initModel();
        if (!model) return resolve(null);

        const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });

        // Convert OGG/Audio Buffer to PCM via FFmpeg
        const command = ffmpeg(Readable.from(audioBuffer))
            .audioFrequency(16000)
            .audioChannels(1)
            .format('s16le') // Raw PCM 16-bit
            .on('error', (err) => {
                console.error("FFmpeg error:", err);
                reject(err);
            });

        const stream = command.pipe();

        const chunks = [];
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
