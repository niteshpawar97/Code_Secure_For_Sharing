// //client/validate-license.js

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Paths to public key and licenses
const PUBLIC_KEY_PATH = path.join(__dirname, '../keys/public.key');

// Validate License Key
function validateLicenseKey(licenseKey) {
    try {
        const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'); // Load public key

        // Decode the license key
        const decodedKey = Buffer.from(licenseKey, 'base64').toString('utf8');
        console.log("Decoded License Key:", decodedKey);

        // Split data and signature
        const splitIndex = decodedKey.lastIndexOf('|'); // Find the last occurrence of '|'
        if (splitIndex === -1) {
            throw new Error("Invalid license key format.");
        }
        const data = decodedKey.substring(0, splitIndex); // Extract data
        const signature = decodedKey.substring(splitIndex + 1); // Extract signature

        console.log("Data Extracted from Key:", data);
        console.log("Signature Extracted from Key:", signature);

        // Verify the signature
        const isVerified = crypto.verify(
            'sha256',
            Buffer.from(data),
            publicKey,
            Buffer.from(signature, 'base64')
        );

        console.log("Signature Verification Result:", isVerified);

        if (!isVerified) {
            return { isValid: false, reason: "Invalid signature." };
        }

        // Extract userName and expiryDate from data
        const [userName, expiryDate] = data.split('|');
        if (!userName || !expiryDate) {
            return { isValid: false, reason: "Invalid data in license key." };
        }

        // Check expiry date
        const expiry = new Date(expiryDate);
        if (new Date() > expiry) {
            return { isValid: false, reason: "License key has expired." };
        }

        return { isValid: true, userName, expiryDate };
    } catch (err) {
        console.error("Validation Error:", err.message);
        return { isValid: false, reason: err.message };
    }
}

// Export the function for reuse
module.exports = { validateLicenseKey };

// Example Usage (for direct execution)
if (require.main === module) {
    const licenseKey = process.argv[2]; // Get license key from command line

    if (!licenseKey) {
        console.error('Usage: node validate-license.js <licenseKey>');
        process.exit(1);
    }

    const result = validateLicenseKey(licenseKey);
    console.log("Validation Result:", result);
}






















// const fs = require('fs');
// const crypto = require('crypto');
// const path = require('path');

// // Paths to public key and licenses
// const PUBLIC_KEY_PATH = path.join(__dirname, '../keys/public.key');

// // Validate License Key
// function validateLicenseKey(licenseKey) {
//     try {
//         const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'); // Load public key

//         // Decode the license key
//         const decodedKey = Buffer.from(licenseKey, 'base64').toString('utf8');
//         console.log("Decoded License Key:", decodedKey);

//         // Split data and signature
//         const splitIndex = decodedKey.lastIndexOf('|'); // Find the last occurrence of '|'
//         if (splitIndex === -1) {
//             throw new Error("Invalid license key format.");
//         }
//         const data = decodedKey.substring(0, splitIndex); // Extract data
//         const signature = decodedKey.substring(splitIndex + 1); // Extract signature

//         console.log("Data Extracted from Key:", data);
//         console.log("Signature Extracted from Key:", signature);

//         // Verify the signature
//         const isVerified = crypto.verify(
//             'sha256',
//             Buffer.from(data),
//             publicKey,
//             Buffer.from(signature, 'base64')
//         );

//         console.log("Signature Verification Result:", isVerified);

//         if (!isVerified) {
//             return { isValid: false, reason: "Invalid signature." };
//         }

//         // Extract userName and expiryDate from data
//         const [userName, expiryDate] = data.split('|');
//         if (!userName || !expiryDate) {
//             return { isValid: false, reason: "Invalid data in license key." };
//         }

//         // Check expiry date
//         const expiry = new Date(expiryDate);
//         if (new Date() > expiry) {
//             return { isValid: false, reason: "License key has expired." };
//         }

//         return { isValid: true, userName, expiryDate };
//     } catch (err) {
//         console.error("Validation Error:", err.message);
//         return { isValid: false, reason: err.message };
//     }
// }

// // Example Usage
// if (require.main === module) {
//     const licenseKey = process.argv[2]; // Get license key from command line

//     if (!licenseKey) {
//         console.error('Usage: node validate-license.js <licenseKey>');
//         process.exit(1);
//     }

//     const result = validateLicenseKey(licenseKey);
//     console.log("Validation Result:", result);
// }

// //node client/validate-license.js bml0ZXNoX3VzZXJ8MjAyNS0xMi0xMXxHTkZSTUdWbnY1MEs5VU5yRkJ2NWZiYmRMVWpKMk9iYVpySUNaeVVTV1BQYTUyM0hQL3Z0SWlVQ0tXeVc0RDFsemtUL25SNjF4VHZvZ0lNQVBGNzljUm5YaW5KSDR4a2w0anR3SWd0RGVSRjZkeitKQ2IydmVmZC9OdUJ2K3RUVkt3ZkRvVlVNSGYzNzVwUnVWTERmSW5JNjl3dEF2YU5sUlI2NHRuV1JLdWRybk1NaUpPQnJ2TTRidTM5cUs1cFN2VUxEdEp6MEpSb2NYck1td3NYdm8rNjR3OUlVOXB6OVROa3RGL29PaEhkYnpEVmlwYlUrY2NJRlNhYnpyUVdtYmFKRTZ0WmZEUktUTUppdlBBOVZtbzBjTE9IYm92Y3E3OXUrOWVUWitxWTEwUGxHQzc4NTJxbU9LZTQ1SmcvSVJCL2tPbzcxR2ZnNC9IcytoRCs4Wnc9PQ==