import getRGB from "consistent-color-generation";
import localforage from "localforage";
import { createKeys } from "./crypto.js";

export function getSelfId() {
  let savedid = localStorage.getItem("id");
  let newId = () => {
    let id = crypto.randomUUID();
    localStorage.setItem("id", id);
    return id;
  };

  return savedid || newId();
}

export function getSelfName() {
  let name = window.webxdc.selfName;
  if (name == window.webxdc.selfAddr) name = "Anonymous";
  return name;
}

export function getSelfColor() {
  return getRGB(window.webxdc.selfAddr).toString();
}

export async function getSelfKeys() {
  let savedKeys = await localforage.getItem("keys");
  let newKeys = async () => {
    let keys = await createKeys();
    localforage.setItem("keys", keys);
    return keys;
  };

  let keys = savedKeys || (await newKeys());
  return keys;
}
