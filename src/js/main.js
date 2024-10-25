import { getSelfId, getSelfName, getSelfColor, getSelfKeys } from "./self.js";
import { exportKey, encrypt, decrypt } from "./crypto.js";
import { newChat, newMsg } from "./ui.js";
import { $ } from "./util.js";
import { encode as arrayBufferToBase64, decode as base64ToArrayBuffer } from "base64-arraybuffer";

let users = {};

const selfKeys = getSelfKeys();
const selfId = getSelfId();
const selfName = getSelfName();
const selfColor = getSelfColor();

$("sendRequestBtn").onclick = sendRequest;

window.webxdc.setUpdateListener((update) => handleIncomingUpdate(update));

async function handleIncomingUpdate(update) {
  const payload = update.payload;
  const sender = payload.self;
  const senderId = sender.id;

  users[senderId] = {
    key: sender.key,
    name: sender.name,
    color: sender.color,
  };

  const msgTo = payload.to;
  if (payload.type == "msg" && (msgTo == selfId || senderId == selfId)) {
    const privateKey = (await selfKeys).privateKey;

    let chatId, encryptedMsg, position;
    if (msgTo == selfId) {
      chatId = senderId;
      encryptedMsg = payload.msg;
      position = "start";
    } else if (senderId == selfId) {
      chatId = msgTo;
      encryptedMsg = sender.msg;
      position = "end";
    }

    getChat(chatId);

    const decryptedMsg = await decryptText(encryptedMsg, privateKey);
    let msg = newMsg(decryptedMsg);
    msg.style.justifyContent = "flex-" + position;

    let chatMsgs = $(chatId + "-msgs");
    chatMsgs.append(msg);
  } else {
    if (senderId != selfId) getChat(senderId);
  }

  function getChat(id) {
    let chat = $(id);
    if (!chat) {
      const user = users[id];
      chat = newChat(id, user.key, user.name, user.color);
      $("chatsDiv").append(chat);
    }

    return chat;
  }
}

async function sendRequest() {
  const publicKey = (await selfKeys).publicKey;
  const jsonWebKey = await exportKey(publicKey);

  const descr = selfName + " is requesting a private chat.";
  const update = {
    payload: {
      type: "request",
      self: {
        key: jsonWebKey,
        id: selfId,
        name: selfName,
        color: selfColor,
      },
    },
    info: descr,
  };

  window.webxdc.sendUpdate(update, descr);
  $("sendRequestDiv").innerHTML =
    "<small>Request sent, wait for others to respond.</small>";
}

/**
 * 
 * @param {string} userId 
 * @param {CryptoKey} userKey 
 * @param {string} text 
 */
export async function sendMsg(userId, userKey, text) {
  const myPublicKey = (await selfKeys).publicKey;

  const encryptedMsg = await encryptText(text, userKey);
  if (!encryptedMsg) return;
  const selfEncryptedCopy = await encryptText(text, myPublicKey);
  if (!selfEncryptedCopy) return;

  const myJsonWebKey = await exportKey(myPublicKey);

  const update = {
    payload: {
      type: "msg",
      msg: encryptedMsg,
      to: userId,
      self: {
        key: myJsonWebKey,
        id: selfId,
        name: selfName,
        color: selfColor,
        msg: selfEncryptedCopy,
      },
    },
  };

  const descr = `${selfName} is sending a message`;

  window.webxdc.sendUpdate(update, descr);
  return true;
}

/**
 * 
 * @param {string} text 
 * @param {CryptoKey} key 
 * @returns {string}
 */
async function encryptText(text, key) {
  try {
    const uint8Array = new TextEncoder().encode(text);
    const encrypted = await encrypt(uint8Array, key);
    const base64 = arrayBufferToBase64(encrypted);
    return base64;
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

/**
 * 
 * @param {string} base64 
 * @param {CryptoKey} key 
 * @returns {string}
 */
async function decryptText(base64, key) {
  try {
    const encrypted = base64ToArrayBuffer(base64);
    const arrayBuffer = await decrypt(encrypted, key);
    const text = new TextDecoder().decode(arrayBuffer);
    return text;
  } catch (err) {
    console.log(err);
    return `This message could not be decrypted, error:\n${err}`;
  }
}
