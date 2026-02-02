const fs = require('fs');
const path = require('path');
const axios = require('axios');
const unzipper = require('unzipper');

const MODELS = [
    {
        url: "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip",
        name: "vosk-model-small-en-us-0.15",
        dest: "model-en"
    },
    {
        url: "https://alphacephei.com/vosk/models/vosk-model-ar-mgb2-0.4.zip",
        name: "vosk-model-ar-mgb2-0.4",
        dest: "model-ar"
    }
];

async function downloadModel() {
    for (const model of MODELS) {
        const destPath = path.join(__dirname, model.dest);
        if (!fs.existsSync(destPath)) {
            console.log(`Downloading ${model.name} (via Axios)...`);
            try {
                const response = await axios({
                    method: 'get',
                    url: model.url,
                    responseType: 'stream'
                });

                await new Promise((resolve, reject) => {
                    response.data.pipe(unzipper.Extract({ path: __dirname }))
                        .on('close', () => {
                            fs.renameSync(path.join(__dirname, model.name), destPath);
                            console.log(`${model.name} downloaded and extracted to /${model.dest}`);
                            resolve();
                        })
                        .on('error', (err) => {
                            console.error(`Unzip error for ${model.name}:`, err);
                            reject(err);
                        });
                });
            } catch (error) {
                console.error(`Download error for ${model.name}:`, error.message);
            }
        } else {
            console.log(`${model.dest} already exists.`);
        }
    }
}

module.exports = downloadModel;
