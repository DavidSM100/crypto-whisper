const rsaAlgorithm = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
}

export function randomId() {
    if (!crypto.randomUUID) {
        const randarray = new Uint8Array(16)
        crypto.getRandomValues(randarray)

        let hexvalues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
        let newUuidString = "";

        for (let i = 0; i < 16; i++) {
            let num = randarray[i]
            let highNibble = Math.floor(num / 16)
            let lowNibble = num % 16

            if (i === 6) {
                newUuidString += "4"
            } else if (i === 8) {
                highNibble = highNibble & 0b0011
                highNibble = highNibble | 0b1000
                newUuidString += hexvalues[highNibble]
            } else {
                newUuidString += hexvalues[highNibble]
            }

            newUuidString += hexvalues[lowNibble]

            if (i === 3 || i === 5 || i === 7 || i === 9) {
                newUuidString += "-"
            }
        }

        return newUuidString;
    } else {
        return crypto.randomUUID();
    }
}


/**
 * 
 * @returns {Promise<CryptoKeyPair>}
 */
export async function createKeys() {
  return await crypto.subtle.generateKey(rsaAlgorithm, true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * 
 * @param {CryptoKey} key 
 * @returns {Promise<JsonWebKey>}
 */
export async function exportKey(key) {
  return crypto.subtle.exportKey("jwk", key);
}

/**
 * 
 * @param {JsonWebKey} jsonWebKey 
 * @returns {Promise<CryptoKey>}
 */
export async function importKey(jsonWebKey) {
  return await crypto.subtle.importKey(
    "jwk",
    jsonWebKey,
    rsaAlgorithm,
    true,
    ["encrypt"],
  );
}

/**
 * 
 * @param {ArrayBuffer} data 
 * @param {CryptoKey} key 
 * @returns {Promise<ArrayBuffer>}
 */
export async function encrypt(data, key) {
  return await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    data,
  );
}

/**
 * 
 * @param {ArrayBuffer} encryptedData 
 * @param {CryptoKey} key 
 * @returns {Promise<ArrayBuffer>}
 */
export async function decrypt(encryptedData, key) {
  return await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    encryptedData,
  );
}
