

# License Key Validation System

This project provides a license validation system with features for RSA key generation, license creation, validation, and a Node.js server that validates the license before running.

---

## **Features**
- RSA **public-private key** generation.
- **License creation** with expiration and user-specific details.
- **Validation** of licenses using the public key.
- A Node.js server that validates the license before starting.

---

## **Setup Instructions**

### 1. **Clone the Repository**
```bash
git clone https://github.com/niteshpawar97/Code_Secure_For_Sharing.git
cd Code_Secure_For_Sharing
```

### 2. **Install Dependencies**
This project uses only built-in Node.js modules, so no additional dependencies are required.

---

## **Project Structure**
```
├── keys/                   # Contains generated private and public keys
│   ├── private.key         # Private key for signing licenses
│   ├── public.key          # Public key for license validation
│   ├── keys_metadata.json  # Metadata with key creation timestamp
│
├── client/                 # Client-side scripts
│   ├── validate-license.js # Script to validate license keys
│
├── licenses/               # Folder for storing license files
│   ├── licenses.json       # Contains generated license details
│
├── generator/              # Key and license generation scripts
│   ├── generate-keys.js    # Script to generate RSA keys
│   ├── generate-license.js # Script to create license keys
│
├── server.js               # Node.js server script
└── README.md               # Project documentation
```

---

## **Usage Instructions**

### 1. **Generate RSA Keys**
Run the following command to generate a private-public key pair:
```bash
node generator/generate-keys.js
```
This will:
- Save the private key to `keys/private.key`.
- Save the public key to `keys/public.key` and `client/keys/public.key`.
- Create a metadata file (`keys/keys_metadata.json`) with the timestamp.

**Note:** If the keys already exist, the script will not overwrite them.

---

### 2. **Create a License Key**
Generate a license key for a specific user with an expiration date:
```bash
node generator/generate-license.js <userName> <expiryDate>
```

**Example**:
```bash
node generator/generate-license.js nitesh_user 2025-12-11
```

This will:
- Sign the `userName` and `expiryDate` using the private key.
- Save the license details in `licenses/licenses.json`.

---

### 3. **Validate a License Key**
Run the following command to validate a license key:
```bash
node client/validate-license.js <licenseKey>
```

**Example**:
```bash
node client/validate-license.js <base64_encoded_license_key>
```

**Output**:
- If valid:
  ```plaintext
  License validated successfully for user: nitesh_user
  ```
- If invalid:
  ```plaintext
  License validation failed: <reason>
  ```

---

### 4. **Start the Server**
The server validates the license before starting. If the license is invalid, the server stops, and `client/validate-license.js` is deleted.

Run the server:
```bash
node server.js
```

**Steps**:
1. Set the license key in an environment variable or pass it to the script:
   ```bash
   export LICENSE_KEY=<base64_encoded_license_key>
   ```
2. Start the server:
   ```bash
   node server.js
   ```

**Expected Output**:
- **Valid License**:
  ```plaintext
  License validated successfully for user: nitesh_user
  Server is running on http://localhost:3000
  ```
- **Invalid License**:
  ```plaintext
  License validation failed: Invalid signature.
  File deleted: client/validate-license.js
  ```

---

## **Development Notes**

### 1. **Regenerate Keys**
To regenerate keys, delete the existing keys manually or pass the `--force` flag:
```bash
node generator/generate-keys.js --force
```

### 2. **Update Expired Licenses**
Manually edit `licenses/licenses.json` to update expiry dates, or regenerate the license key using `generate-license.js`.

---

## **Error Handling**
- If the license key format is invalid or corrupted, you’ll see:
  ```plaintext
  Validation Error: Invalid license key format.
  ```
- If the signature is invalid or the key has expired:
  ```plaintext
  License validation failed: Invalid signature.
  ```

---

## **Security Recommendations**
1. Keep `keys/private.key` secure and never expose it publicly.
2. Use HTTPS for secure communication when deploying the server.
3. Regenerate the RSA key pair periodically for enhanced security.

---

## **FAQs**

### Q1. How do I handle expired licenses?
Regenerate a new license key for the user using `generate-license.js`.

### Q2. What happens if the public and private keys don’t match?
License validation will fail with the reason `Invalid signature.`. Ensure the public and private keys are from the same pair.

### Q3. How do I change the default RSA key size?
Edit the `modulusLength` in `generate-keys.js`:
```javascript
modulusLength: 2048, // Change to 4096 for higher security
```

---

## **Contact**
For issues or feature requests, please raise a GitHub issue or contact the repository maintainer.

Happy Coding! 😊
--------------------------------------------------


# Code_Secure_For_Sharing
आप सही कह रहे हैं, केवल index.js को obfuscate करने से बाकी files (जैसे controllers, models, routes आदि) अभी भी original form में रहती हैं। पूरे प्रोजेक्ट को secure करने के लिए सभी JavaScript files को obfuscate करना होगा।  इसके लिए आप पूरी project directory को process करने के लिए javascript-obfuscator का उपयोग कर सकते हैं। 

---

## **1. पूरी Directory को Obfuscate करें**

#### **Step 1: Install `javascript-obfuscator` Globally**
```bash
npm install -g javascript-obfuscator
```

#### **Step 2: Obfuscate Entire Directory**
```bash
javascript-obfuscator ./ --output ./obfuscated --exclude node_modules
```

- **`./`**: यह command current directory की सभी files को obfuscate करेगा।
- **`--output ./obfuscated`**: Output directory का नाम (`obfuscated`) जहाँ obfuscated files save होंगी।
- **`--exclude node_modules`**: `node_modules` directory को exclude करेगा, ताकि dependencies obfuscate न हों।

---

## **2. Validate Obfuscated Code**

#### **Step 1: Run Obfuscated Code**
```bash
cd obfuscated
node index.js
```

#### **Step 2: Debug Errors**
अगर कोई error आती है, तो ensure करें कि obfuscation options और paths सही तरीके से सेट किए गए हैं। 

---

## **3. Code Tampering से बचाव के लिए Additional Steps**

#### **Step 1: Obfuscator Options Use करें**
आप obfuscation को और secure बनाने के लिए advanced options का उपयोग कर सकते हैं:
```bash
javascript-obfuscator ./ --output ./obfuscated --compact true --control-flow-flattening true --self-defending true --disable-console-output true --exclude node_modules
```

- **`--compact true`**: Code को छोटा और unreadable बनाता है।
- **`--control-flow-flattening true`**: Code के execution logic को obscure करता है।
- **`--self-defending true`**: Obfuscated code को tampering से बचाता है।
- **`--disable-console-output true`**: Console messages को disable करता है।

---

## **4. Original Source Code को Replace करें**

#### **Step 1: Backup Original Files**
Original files का backup लें:
```bash
mv ./index.js ./index-original.js
```

#### **Step 2: Use Obfuscated Files**
Obfuscated files को main project directory में replace करें:
```bash
cp -r ./obfuscated/* ./
```

---

## **5. Complete Protection Strategy**

1. **License Validation**:
   - Backend में license validation logic implement करें, जैसा मैंने पहले बताया।

2. **Environment Variables Use करें**:
   - Sensitive information (जैसे API keys, database credentials) को hardcode न करें। `.env` file में रखें।

3. **Executable Binary Create करें** (Optional):
   - Backend को `pkg` tool के साथ binary में convert करें:
     ```bash
     npm install -g pkg
     pkg index.js --targets node18-win-x64
     ```

4. **Tamper Detection**:
   - Application में self-check mechanisms implement करें, ताकि tampering detect हो सके।

---
