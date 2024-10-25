import { $new, autoResize, copy } from "./util.js";
import { importKey } from "./crypto.js";
import { sendMsg } from "./main.js";

export function newChat(userId, userJsonKey, userName, userColor) {
  const userKey = importKey(userJsonKey);

  let chatDiv = $new("div");
  chatDiv.id = userId;
  chatDiv.classList.add("chat-div");
  chatDiv.style.borderColor = userColor;

  let name = $new("div");
  name.innerHTML = `<b style="color:${userColor}">${userName}</b>`;
  name.classList.add("user-name");

  let msgsDiv = $new("div");
  msgsDiv.id = userId + "-msgs";

  let sendForm = $new("form");
  sendForm.style.color = userColor;
  sendForm.classList.add("send-form");

  let sendTextarea = $new("textarea");
  sendTextarea.rows = "1";
  sendTextarea.placeholder = "Message";
  sendTextarea.style.borderColor = userColor;
  sendTextarea.style.caretColor = userColor;
  sendTextarea.style.outlineColor = userColor;

  let sendButton = $new("button");
  let sendImg = $new("img");
  sendImg.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${userColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  sendButton.append(sendImg);

  sendTextarea.oninput = () => autoResize(sendTextarea);
  sendTextarea.onkeydown = (event) => {
    if (event.code == "Enter" || event.code == "NumpadEnter") {
      event.preventDefault();
      if (event.shiftKey) {
        sendTextarea.value = sendTextarea.value + "\n";
        autoResize(sendTextarea);
      } else {
        sendButton.click();
      }
    }
  };

  sendButton.onclick = async (event) => {
    event.preventDefault();
    const key = await userKey;
    const msg = sendTextarea.value.trim();
    if (msg) {
      const msgSent = await sendMsg(userId, key, msg);
      if (msgSent) {
        sendTextarea.value = "";
        autoResize(sendTextarea);
      }
    }
  };

  sendForm.append(sendTextarea);
  sendForm.append(sendButton);

  chatDiv.append(name);
  chatDiv.append(msgsDiv);
  chatDiv.append(sendForm);

  return chatDiv;
}

export function newMsg(text) {
  let msg = $new("div");
  msg.classList.add("msg");

  let msgText = $new("div");
  msgText.innerText = text;
  msgText.onclick = () => copy(text);

  msg.append(msgText);

  return msg;
}
