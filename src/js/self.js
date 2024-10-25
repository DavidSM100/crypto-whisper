import getRGB from "consistent-color-generation";
import localforage from "localforage";
import { createKeys, randomId } from "./crypto.js";

const xdcName = webxdc.selfName;
const xdcAddr = webxdc.selfAddr;

export function getSelfId() {
  let id = localStorage.getItem("id");
  if (!id) {
    id = randomId();
    localStorage.setItem("id", id);
  }

  return id;
}

/**
 * 
 * @returns {string}
 */
export function getSelfName() {
  let name = xdcName;
  if (name == xdcAddr) name = "Anonymous";
  return name;
}

export function getSelfColor() {
  return getRGB(xdcAddr).toString();
}

/**
 * 
 * @returns {Promise<CryptoKeyPair>}
 */
export async function getSelfKeys() {
  let keys = await localforage.getItem("keys");
  if (!keys) {
    keys = await createKeys();
    await localforage.setItem("keys", keys);
  }

  return keys;
}
