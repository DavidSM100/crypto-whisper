const rsaAlgorithm = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
}

export const randomId = () => crypto.randomUUID();

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
