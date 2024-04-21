import { getSelfId, getSelfName, getSelfColor, getSelfKeys } from "./self.js";
import { exportKey, encrypt, decrypt } from "./crypto.js";
import { newChat, newMsg } from "./ui.js";
import {
  $,
  textToArrayBuffer,
  arrayBufferToText,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "./util.js";

let webxdc = window.webxdc;

let users = {};

let selfId = getSelfId();
let selfKeys = getSelfKeys();
let selfName = getSelfName();
let selfColor = getSelfColor();

$("sendRequestBtn").onclick = sendRequest;

webxdc.setUpdateListener((update) => handleIncomingUpdate(update));

async function handleIncomingUpdate(update) {
  let payload = update.payload;
  let sender = payload.self;
  let senderId = sender.id;

  users[senderId] = {
    key: sender.key,
    name: sender.name,
    color: sender.color,
  };

  let msgTo = payload.to;
  if (payload.type == "msg" && (msgTo == selfId || senderId == selfId)) {
    let privateKey = (await selfKeys).privateKey;

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

    let chat = getChat(chatId);

    let decryptedMsg = await decryptText(encryptedMsg, privateKey);
    let msg = newMsg(decryptedMsg);
    msg.style.justifyContent = "flex-" + position;

    chat.append(msg);
  } else {
    if (senderId != selfId) getChat(senderId);
  }

  function getChat(id) {
    let chat = $(id);
    if (!chat) {
      let user = users[id];
      chat = newChat(id, user.key, user.name, user.color);
      $("chatsDiv").append(chat);
    }

    return chat;
  }
}

async function sendRequest() {
  let publicKey = (await selfKeys).publicKey;
  let jsonWebKey = await exportKey(publicKey);

  let descr = `${selfName} is requesting to chat`;
  let update = {
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

  webxdc.sendUpdate(update, descr);
  $("headerDiv").innerHTML =
    "<small>Request sent, wait for others to respond.</small>";
}

export async function sendMsg(userId, userKey, text) {
  let myPublicKey = (await selfKeys).publicKey;

  let encryptedMsg = await encryptText(text, userKey);
  if (!encryptedMsg) return;
  let selfEncryptedCopy = await encryptText(text, myPublicKey);
  if (!selfEncryptedCopy) return;

  let myJsonWebKey = await exportKey(myPublicKey);

  let update = {
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

  let descr = `${selfName} is sending a message`;

  webxdc.sendUpdate(update, descr);
}

async function encryptText(text, key) {
  try {
    let arrayBuffer = textToArrayBuffer(text);
    let encryptedArrayBuffer = await encrypt(arrayBuffer, key);
    let base64 = arrayBufferToBase64(encryptedArrayBuffer);

    return base64;
  } catch {
    alert("Message too long");
  }
}

async function decryptText(encryptedText, key) {
  try {
    let encryptedArrayBuffer = base64ToArrayBuffer(encryptedText);
    let decryptedArrayBuffer = await decrypt(encryptedArrayBuffer, key);
    let text = arrayBufferToText(decryptedArrayBuffer);

    return text;
  } catch {
    return "This message could not be decrypted";
  }
}
