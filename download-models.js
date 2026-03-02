const https = require('https');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'client', 'public', 'models');
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const filesToDownload = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1'
];

const downloadFile = (filename) => {
    return new Promise((resolve, reject) => {
        const dest = path.join(modelsDir, filename);
        const file = fs.createWriteStream(dest);
        https.get(baseUrl + filename, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const run = async () => {
    console.log('Downloading AI models...');
    for (const file of filesToDownload) {
        console.log(`Downloading ${file}...`);
        await downloadFile(file);
    }
    console.log('Done!');
};

run();
