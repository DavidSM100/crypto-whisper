import { encode, decode } from "base64-arraybuffer";

export let $ = (id) => document.getElementById(id);
export let $new = (tag) => document.createElement(tag);

export let textToArrayBuffer = (text) => new TextEncoder().encode(text);
export let arrayBufferToText = (arrayBuffer) => new TextDecoder().decode(arrayBuffer);

export let arrayBufferToBase64 = (arrayBuffer) => encode(arrayBuffer);
export let base64ToArrayBuffer = (base64) => decode(base64);

export function copy(text) {
  const temp = document.createElement("textarea");
  temp.innerText = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}
