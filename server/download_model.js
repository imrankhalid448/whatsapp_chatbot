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
        url: "https://alphacephei.com/vosk/models/vosk-model-small-ar-0.3.zip",
        name: "vosk-model-small-ar-0.3",
        dest: "model-ar"
    }
];

async function downloadModel() {
    for (const model of MODELS) {
        const destPath = path.join(__dirname, model.dest);
        const markerFile = path.join(destPath, '.model_name');

        // Force re-download if folder doesn't exist OR if it's the wrong model version
        let shouldDownload = !fs.existsSync(destPath);
        if (!shouldDownload && fs.existsSync(markerFile)) {
            const currentName = fs.readFileSync(markerFile, 'utf8').trim();
            if (currentName !== model.name) {
                console.log(`Model version mismatch for ${model.dest}. Expected ${model.name}, found ${currentName}. Deleting and re-downloading...`);
                fs.rmSync(destPath, { recursive: true, force: true });
                shouldDownload = true;
            }
        }

        if (shouldDownload) {
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
                            // The extracted folder name varies, find it or assume model.name
                            const extractedDir = path.join(__dirname, model.name);
                            if (fs.existsSync(extractedDir)) {
                                fs.renameSync(extractedDir, destPath);
                            }
                            // Save marker to detect future version changes
                            fs.writeFileSync(markerFile, model.name);
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
            console.log(`${model.dest} already exists and is up to date.`);
        }
    }
}

module.exports = downloadModel;
