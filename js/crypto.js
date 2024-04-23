let rsaAlgorithm = () => {
  return {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  };
};

export let randomId = () => crypto.randomUUID();

export async function createKeys() {
  let keys = await crypto.subtle.generateKey(rsaAlgorithm(), true, [
    "encrypt",
    "decrypt",
  ]);

  return keys;
}

export async function exportKey(key) {
  return crypto.subtle.exportKey("jwk", key);
}

export async function importKey(jsonWebKey) {
  let key = await crypto.subtle.importKey(
    "jwk",
    jsonWebKey,
    rsaAlgorithm(),
    true,
    ["encrypt"],
  );

  return key;
}

export async function encrypt(arrayBuffer, key) {
  let encryptedArrayBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    arrayBuffer,
  );

  return encryptedArrayBuffer;
}

export async function decrypt(encryptedArrayBuffer, key) {
  let decryptedArrayBuffer = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    encryptedArrayBuffer,
  );

  return decryptedArrayBuffer;
}
