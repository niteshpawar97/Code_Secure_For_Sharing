const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Paths to save keys
const KEYS_FOLDER = path.join(__dirname, '../keys');
const CLIENT_KEYS_FOLDER = path.join(__dirname, '../client/keys');
const PRIVATE_KEY_PATH = path.join(KEYS_FOLDER, 'private.key');
const PUBLIC_KEY_PATH = path.join(KEYS_FOLDER, 'public.key');
const CLIENT_PUBLIC_KEY_PATH = path.join(CLIENT_KEYS_FOLDER, 'public.key');
const METADATA_PATH = path.join(KEYS_FOLDER, 'keys_metadata.json');

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(KEYS_FOLDER)) {
        fs.mkdirSync(KEYS_FOLDER, { recursive: true });
    }
    if (!fs.existsSync(CLIENT_KEYS_FOLDER)) {
        fs.mkdirSync(CLIENT_KEYS_FOLDER, { recursive: true });
    }
}

// Check if a file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Generate RSA Key Pair
function generateKeyPair() {
    if (fileExists(PRIVATE_KEY_PATH) && fileExists(PUBLIC_KEY_PATH)) {
        console.log("Keys already exist. No new keys were generated.");
        return;
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });

    // Save private key
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey.export({ type: 'pkcs1', format: 'pem' }), { mode: 0o600 });

    // Save public key
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey.export({ type: 'pkcs1', format: 'pem' }));
    fs.writeFileSync(CLIENT_PUBLIC_KEY_PATH, publicKey.export({ type: 'pkcs1', format: 'pem' }));

    // Save metadata with creation timestamp
    const metadata = {
        createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 4));

    console.log(`Keys generated successfully:`);
    console.log(` - Private Key: ${PRIVATE_KEY_PATH}`);
    console.log(` - Public Key (Server): ${PUBLIC_KEY_PATH}`);
    console.log(` - Public Key (Client): ${CLIENT_PUBLIC_KEY_PATH}`);
    console.log(` - Metadata saved in: ${METADATA_PATH}`);

    // Output key fingerprint
    const publicKeyFingerprint = crypto
        .createHash('sha256')
        .update(publicKey.export({ type: 'pkcs1', format: 'pem' }))
        .digest('hex');
    console.log(`Public Key Fingerprint: ${publicKeyFingerprint}`);
}

// Ensure directories and run key generation
ensureDirectories();
generateKeyPair();
