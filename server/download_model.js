async function downloadModel() {
    if (!fs.existsSync(MODEL_DIR)) {
        console.log("Downloading Vosk Model...");
        return new Promise((resolve, reject) => {
            https.get(MODEL_URL, (response) => {
                response.pipe(unzipper.Extract({ path: __dirname }))
                    .on('close', () => {
                        fs.renameSync(path.join(__dirname, 'vosk-model-small-en-us-0.15'), MODEL_DIR);
                        console.log("Model downloaded and extracted to /model");
                        resolve();
                    })
                    .on('error', reject);
            }).on('error', reject);
        });
    } else {
        console.log("Model already exists.");
        return Promise.resolve();
    }
}

module.exports = downloadModel;
