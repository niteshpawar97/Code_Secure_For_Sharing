const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Paths to keys and licenses folder
const PRIVATE_KEY_PATH = path.join(__dirname, '../keys/private.key');
const PUBLIC_KEY_PATH = path.join(__dirname, '../keys/public.key');
const LICENSES_FOLDER_PATH = path.join(__dirname, '../licenses');
const LICENSES_JSON_PATH = path.join(LICENSES_FOLDER_PATH, 'licenses.json');

// Ensure the licenses folder and file exist
function ensureLicensesFolder() {
    if (!fs.existsSync(LICENSES_FOLDER_PATH)) {
        fs.mkdirSync(LICENSES_FOLDER_PATH, { recursive: true });
    }
    if (!fs.existsSync(LICENSES_JSON_PATH)) {
        fs.writeFileSync(LICENSES_JSON_PATH, JSON.stringify([])); // Create an empty array
    }
}

function generateLicenseKey(userName, expiryDate) {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'); // Load private key
    const data = `${userName}|${expiryDate}`; // Data to sign

    console.log("Data to Sign:", data); // Log the data to be signed

    // Sign the data
    const signature = crypto.sign('sha256', Buffer.from(data), privateKey);
    const base64Signature = signature.toString('base64'); // Encode signature in Base64

    console.log("Signature:", base64Signature); // Log the generated signature

    // Combine data and signature into a license key
    const licenseKey = `${data}|${base64Signature}`; // Combine `data` and `signature`
    const encodedLicenseKey = Buffer.from(licenseKey).toString('base64'); // Encode in Base64

    console.log("Generated License Key (Base64):", encodedLicenseKey); // Log the complete license key

    return encodedLicenseKey; // Return Base64 encoded license key
}


function verifyLicenseKey(userName, expiryDate, licenseKey) {
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'); // Load public key

    // Decode the license key
    const decodedKey = Buffer.from(licenseKey, 'base64').toString('utf8');
    console.log("Decoded License Key:", decodedKey);

    // Split data and signature
    const splitIndex = decodedKey.lastIndexOf('|'); // Find the last occurrence of '|'
    const data = decodedKey.substring(0, splitIndex); // Extract data
    const signature = decodedKey.substring(splitIndex + 1); // Extract signature

    console.log("Data Extracted from Key:", data);
    console.log("Signature Extracted from Key:", signature);

    // Verify signature
    const isVerified = crypto.verify(
        'sha256',
        Buffer.from(data),
        publicKey,
        Buffer.from(signature, 'base64') // Decode signature from Base64
    );

    console.log("Signature Verification Result:", isVerified);

    // Check if the userName and expiryDate match
    const [decodedUserName, decodedExpiryDate] = data.split('|');
    console.log("Decoded User Name:", decodedUserName);
    console.log("Decoded Expiry Date:", decodedExpiryDate);

    if (!isVerified || decodedUserName !== userName || decodedExpiryDate !== expiryDate) {
        console.error("Verification Failed: Data mismatch or invalid signature.");
        return false;
    }

    return true;
}



// Store license in JSON file under the licenses folder
function storeLicense(userName, expiryDate, licenseKey) {
    ensureLicensesFolder();

    // Read existing licenses
    const licenses = JSON.parse(fs.readFileSync(LICENSES_JSON_PATH, 'utf8'));

    // Check for duplicates
    const existingLicense = licenses.find(
        (license) => license.userName === userName && license.expiryDate === expiryDate
    );

    if (existingLicense) {
        console.log("Duplicate license found. Returning existing license.");
        return existingLicense.licenseKey;
    }

    // Create new license object
    const newLicense = {
        userName,
        expiryDate,
        licenseKey,
        createdAt: new Date().toISOString(),
    };

    // Add to licenses and save
    licenses.push(newLicense);
    fs.writeFileSync(LICENSES_JSON_PATH, JSON.stringify(licenses, null, 4));

    console.log(`License stored in: ${LICENSES_JSON_PATH}`);
    return licenseKey;
}

// Example Usage
if (require.main === module) {
    const userName = process.argv[2]; // Get user name from command line
    const expiryDate = process.argv[3]; // Get expiry date from command line

    if (!userName || !expiryDate) {
        console.error('Usage: node generate-license.js <userName> <expiryDate>');
        process.exit(1);
    }

    const licenseKey = generateLicenseKey(userName, expiryDate);
    console.log("Generated License Key:", licenseKey);

    // Verify the license key
    if (verifyLicenseKey(userName, expiryDate, licenseKey)) {
        console.log("License Key Verified Successfully!");

        // Store the license in JSON
        const storedKey = storeLicense(userName, expiryDate, licenseKey);
        console.log("Stored License Key:", storedKey);
    } else {
        console.error("License Key Verification Failed! Not storing the license.");
    }
}
