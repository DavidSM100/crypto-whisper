import { $new, copy } from "./util.js";
import { importKey } from "./crypto.js";
import { sendMsg } from "./main.js";

export function newChat(userId, userJsonKey, userName, userColor) {
  let userKey = importKey(userJsonKey);

  let chat = $new("div");
  chat.id = userId;
  chat.classList.add("chat-div");
  chat.style.borderColor = userColor;

  let name = $new("div");
  name.innerHTML = `<b style="color:${userColor}">${userName}</b>`;
  name.classList.add("user-name");

  let sendForm = $new("form");
  sendForm.style.color = userColor;
  sendForm.classList.add("send-form");

  let sendInput = $new("input");
  sendInput.type = "text";
  sendInput.placeholder = "Message";
  sendInput.style.borderColor = userColor;
  sendInput.style.caretColor = userColor;
  sendInput.style.outlineColor = userColor;

  let sendButton = $new("button");
  let sendImg = $new("img");
  sendImg.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${userColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  sendButton.append(sendImg);

  sendButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let key = await userKey;
    let msg = sendInput.value.trim();
    if (msg) {
      sendMsg(userId, key, msg);
    }
    sendInput.value = "";
  });

  sendForm.append(sendInput);
  sendForm.append(sendButton);

  chat.append(name);
  chat.append(sendForm);

  return chat;
}

export function newMsg(text) {
  let msg = $new("div");
  msg.classList.add("msg");
  let msgText = $new("div");
  msgText.innerHTML = text;
  msgText.addEventListener("click", () => copy(text));
  msg.append(msgText);

  return msg;
}
