const { google } = require("googleapis");

async function createLabel(auth, labelName) {
    //function to create a label or return the existing label ID
    const gmail = google.gmail({ version: "v1", auth });
  
    try {
      const response = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      console.log("Label created:", response.data);
      return response.data.id;
    } catch (error) {
      if (error.code === 409) {
        const response = await gmail.users.labels.list({ userId: "me" });
        const label = response.data.labels.find(
          (existingLabel) => existingLabel.name === labelName
        );
        if (label) {
          console.log("Label already exists:", label);
          return label.id;
        } else {
          console.error("Label not found after conflict:", error);
          throw error;
        }
      } else {
        console.error("Error creating label:", error);
        throw error;
      }
    }
  }
  

async function getUnrepliedMessages(auth) {
    //function to fetch messages
  const gmail = google.gmail({ version: "v1", auth });
  
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: "is:unread",
  });

  return response.data.messages || [];
}

async function sendAutoReply(auth, to, subject) {
    //function to send reply mail.
  const gmail = google.gmail({ version: "v1", auth });

  const replyMessage = {
    userId: "me",
    resource: {
      raw: Buffer.from(
        `To: ${to}\r\n` +
        `Subject: ${subject}\r\n` +
        `Content-Type: text/plain; charset="UTF-8"\r\n` +
        `Content-Transfer-Encoding: 7bit\r\n\r\n` +
        `Hello,\n I appreciate your reaching out to me. I'd like to extend my apologies for not being able to respond promptly, as I am currently on vacation. Rest assured, I will get back to you at my earliest convenience. \nThank you for your understanding.\r\n`
      ).toString("base64"),
    },
  };
  
  await gmail.users.messages.send(replyMessage);
}

async function labelAndMoveEmail(auth, messageId, labelId) {
    //function to label email
  const gmail = google.gmail({ version: "v1", auth });

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    resource: {
      addLabelIds: [labelId],
      removeLabelIds: ["INBOX"],
    },
  });
}
async function getMessage(auth, messageId) {
  const gmail = google.gmail({ version: "v1", auth });

  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  return response.data;
}
module.exports = {
  createLabel,
  getUnrepliedMessages,
  sendAutoReply,
  labelAndMoveEmail,
  getMessage,
};
