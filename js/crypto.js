export async function createKeys() {
  let algorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" },
  };

  let keys = await crypto.subtle.generateKey(algorithm, true, [
    "encrypt",
    "decrypt",
  ]);

  return keys;
}

export async function exportKey(key) {
  return crypto.subtle.exportKey("jwk", key);
}

export async function importKey(jsonKey) {
  let algorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" },
  };

  let key = await crypto.subtle.importKey("jwk", jsonKey, algorithm, true, [
    "encrypt",
  ]);
  return key;
}

export async function encrypt(arrayBuffer, key) {
  let encryptedArrayBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
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
