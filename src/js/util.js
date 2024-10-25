import { encode, decode } from "base64-arraybuffer";

export let $ = (id) => document.getElementById(id);
export let $new = (tag) => document.createElement(tag);

export let textToArrayBuffer = (text) => new TextEncoder().encode(text);
export let arrayBufferToText = (arrayBuffer) => new TextDecoder().decode(arrayBuffer);

export let arrayBufferToBase64 = (arrayBuffer) => encode(arrayBuffer);
export let base64ToArrayBuffer = (base64) => decode(base64);

export function copy(text) {
  let textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}


export function autoResize(element) {
  element.style.height = "auto";
  element.style.height = (element.scrollHeight - 10) + "px";
}
