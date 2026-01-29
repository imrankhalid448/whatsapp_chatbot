const fs = require('fs');
const path = require('path');
const axios = require('axios');
const unzipper = require('unzipper');

const MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip";
const MODEL_DIR = path.join(__dirname, 'model');

async function downloadModel() {
    if (!fs.existsSync(MODEL_DIR)) {
        console.log("Downloading Vosk Model (via Axios)...");
        try {
            const response = await axios({
                method: 'get',
                url: MODEL_URL,
                responseType: 'stream'
            });

            return new Promise((resolve, reject) => {
                response.data.pipe(unzipper.Extract({ path: __dirname }))
                    .on('close', () => {
                        fs.renameSync(path.join(__dirname, 'vosk-model-small-en-us-0.15'), MODEL_DIR);
                        console.log("Model downloaded and extracted to /model");
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error("Unzip error:", err);
                        reject(err);
                    });
            });
        } catch (error) {
            console.error("Download error:", error.message);
        }
    } else {
        console.log("Model already exists.");
        return Promise.resolve();
    }
}

module.exports = downloadModel;
