const fs = require('fs');
const path = require('path');
const https = require('https');
const unzipper = require('unzipper');

const MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip";
const MODEL_DIR = path.join(__dirname, 'model');

if (!fs.existsSync(MODEL_DIR)) {
    console.log("Downloading Vosk Model...");
    https.get(MODEL_URL, (response) => {
        response.pipe(unzipper.Extract({ path: __dirname }))
            .on('close', () => {
                fs.renameSync(path.join(__dirname, 'vosk-model-small-en-us-0.15'), MODEL_DIR);
                console.log("Model downloaded and extracted to /model");
            });
    });
} else {
    console.log("Model already exists.");
}
