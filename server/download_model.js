const fs = require('fs');
const path = require('path');
const axios = require('axios');
const unzipper = require('unzipper');

const MODELS = [
    {
        name: 'model-en',
        url: "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip",
        folder: 'vosk-model-small-en-us-0.15'
    },
    {
        name: 'model-ar',
        url: "https://alphacephei.com/vosk/models/vosk-model-ar-0.22-linto-1.1.0.zip",
        folder: 'vosk-model-ar-0.22-linto-1.1.0'
    }
];

async function downloadModel() {
    for (const modelInfo of MODELS) {
        const targetDir = path.join(__dirname, modelInfo.name);
        if (!fs.existsSync(targetDir)) {
            console.log(`Downloading Vosk ${modelInfo.name} Model...`);
            try {
                const response = await axios({
                    method: 'get',
                    url: modelInfo.url,
                    responseType: 'stream'
                });

                await new Promise((resolve, reject) => {
                    response.data.pipe(unzipper.Extract({ path: __dirname }))
                        .on('close', () => {
                            fs.renameSync(path.join(__dirname, modelInfo.folder), targetDir);
                            console.log(`Model ${modelInfo.name} downloaded and extracted.`);
                            resolve();
                        })
                        .on('error', (err) => {
                            console.error(`Unzip error for ${modelInfo.name}:`, err);
                            reject(err);
                        });
                });
            } catch (error) {
                console.error(`Download error for ${modelInfo.name}:`, error.message);
            }
        } else {
            console.log(`Model ${modelInfo.name} already exists.`);
        }
    }
}

module.exports = downloadModel;
