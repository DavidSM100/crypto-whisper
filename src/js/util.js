/**
 * 
 * @param {string} id 
 * @returns {HTMLElement | null}
 */
export const $ = (id) => document.getElementById(id);

/**
 * 
 * @param {string} tag 
 * @returns {HTMLElement}
 */
export const $new = (tag) => document.createElement(tag);

/**
 * 
 * @param {string} text 
 * @returns {ArrayBuffer}
 */
export const textToArrayBuffer = (text) => new TextEncoder().encode(text);

/**
 * 
 * @param {ArrayBuffer} arrayBuffer 
 * @returns {string}
 */
export const arrayBufferToText = (arrayBuffer) => new TextDecoder().decode(arrayBuffer);

/**
 * 
 * @param {string} text 
 */
export function copy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}