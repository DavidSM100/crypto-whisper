import getRGB from "consistent-color-generation";
import localforage from "localforage";
import { createKeys, randomId } from "./crypto.js";

let webxdc = window.webxdc;

let xdcName = webxdc.selfName;
let xdcAddr = webxdc.selfAddr;

export function getSelfId() {
  let savedid = localStorage.getItem("id");
  let newId = () => {
    let id = randomId();
    localStorage.setItem("id", id);
    return id;
  };

  return savedid || newId();
}

export function getSelfName() {
  let name = xdcName;
  if (name == xdcAddr) name = "Anonymous";
  return name;
}

export function getSelfColor() {
  return getRGB(xdcAddr).toString();
}

export async function getSelfKeys() {
  let savedKeys = await localforage.getItem("keys");
  let newKeys = async () => {
    let keys = await createKeys();
    localforage.setItem("keys", keys);
    return keys;
  };

  return savedKeys || (await newKeys());
}
