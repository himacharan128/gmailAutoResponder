const express = require("express");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const gmailFunctions = require("./gmailFunctions");

const app = express();
const port = 8080;

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];
const labelName = "AutoReplied mails";

async function processUnrepliedMessages(auth) {
  try {
    const labelId = await gmailFunctions.createLabel(auth, labelName);

    // Fetching unreplied messages
    const unrepliedMessages = await gmailFunctions.getUnrepliedMessages(auth);
    console.log("Unreplied Messages:", unrepliedMessages);

    for (const message of unrepliedMessages) {
      const messageData = await gmailFunctions.getMessage(auth, message.id);
      const hasReplied = messageData.payload.headers.some(
          (header) => header.name === "In-Reply-To"
      );

      if (!hasReplied) {
          // Reply message
          const to=messageData.payload.headers.find((header) => header.name === "From")
          console.log(to)
          const subject=messageData.payload.headers.find((header) => header.name === "Subject")
          console.log(subject)
          await gmailFunctions.sendAutoReply( auth,to.value,subject.value);
          // Labeling and moving the email
          await gmailFunctions.labelAndMoveEmail(auth, message.id, labelId);
      }
    }

    console.log({ "this is Auth": auth });
  } catch (error) {
    console.error("Error:", error);
  }
}

app.get("/", async (req, res) => {
  try {
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "userSecret.json"),
      scopes: SCOPES,
    });

    // Runing the processing function for the first time
    await processUnrepliedMessages(auth);

    // Setting up interval randomly 45-120
    setInterval(async () => {
      await processUnrepliedMessages(auth);
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);

    res.json({ "this is Auth": auth });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// app.get("/", async (req, res) => {
//   try {
//     const auth = await authenticate({
//       keyfilePath: path.join(__dirname, "userSecret.json"),
//       scopes: SCOPES,
//     });
//     //console.log(auth)
//     const labelId = await gmailFunctions.createLabel(auth, labelName);

//     // Fetch unreplied messages
//     const unrepliedMessages = await gmailFunctions.getUnrepliedMessages(auth);
//     console.log("Unreplied Messages:", unrepliedMessages);

//     for (const message of unrepliedMessages) {
//       const messageData = await gmailFunctions.getMessage(auth, message.id);
//       const hasReplied = messageData.payload.headers.some(
//           (header) => header.name === "In-Reply-To"
//       );

//       if (!hasReplied) {
//           // Craft the reply message
//           const to=messageData.payload.headers.find((header) => header.name === "From")
//           console.log(to)
//           const subject=messageData.payload.headers.find((header) => header.name === "Subject")
//           console.log(subject)
//           await gmailFunctions.sendAutoReply( auth,to.value,subject.value);
//           // Label and move the email
//           await gmailFunctions.labelAndMoveEmail(auth, message.id, labelId);
//       }
//     }

//     res.json({ "this is Auth": auth });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
