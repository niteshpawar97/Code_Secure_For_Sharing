const path = require('path');
const fs = require('fs');
const http = require('http');
const { validateLicenseKey } = require('./client/validate-license');

// License key to validate
const LICENSE_KEY = process.env.LICENSE_KEY || 'bml0ZXNoX3VzZXJ8MjAyNS0xMi0xMXxHTkZSTUdWbnY1MEs5VU5yRkJ2NWZiYmRMVWpKMk9iYVpySUNaeVVTV1BQYTUyM0hQL3Z0SWlVQ0tXeVc0RDFsemtUL25SNjF4VHZvZ0lNQVBGNzljUm5YaW5KSDR4a2w0anR3SWd0RGVSRjZkeitKQ2IydmVmZC9OdUJ2K3RUVkt3ZkRvVlVNSGYzNzVwUnVWTERmSW5JNjl3dEF2YU5sUlI2NHRuV1JLdWRybk1NaUpPQnJ2TTRidTM5cUs1cFN2VUxEdEp6MEpSb2NYck1td3NYdm8rNjR3OUlVOXB6OVROa3RGL29PaEhkYnpEVmlwYlUrY2NJRlNhYnpyUVdtYmFKRTZ0WmZEUktUTUppdlBBOVZtbzBjTE9IYm92Y3E3OXUrOWVUWitxWTEwUGxHQzc4NTJxbU9LZTQ1SmcvSVJCL2tPbzcxR2ZnNC9IcytoRCs4Wnc9PQ==';

// Path to the validateLicenseKey.js file
const VALIDATE_LICENSE_PATH = path.join(__dirname, './client/testfile.js');

// Validate the license key
function validateLicense() {
    const result = validateLicenseKey(LICENSE_KEY);

    if (!result.isValid) {
        console.error(`License validation failed: ${result.reason}`);

        
        // Delete the testfile.js file
        try {
            if (fs.existsSync(VALIDATE_LICENSE_PATH)) {
                fs.unlinkSync(VALIDATE_LICENSE_PATH);
                console.log(`File deleted: ${VALIDATE_LICENSE_PATH}`);
            }
        } catch (err) {
            console.error(`Failed to delete file: ${err.message}`);
        }

        process.exit(1); // Stop server if license is invalid
    }

    console.log(`License validated successfully for user: ${result.userName}`);
    return result;
}

// Start the server if the license is valid
function startServer() {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        //add emogis 
        res.end('Server is running with a valid license key!\n');
    });

    const PORT = process.env.PORT || 3333;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Main execution
const licenseResult = validateLicense();
if (licenseResult.isValid) {
    startServer();
}
