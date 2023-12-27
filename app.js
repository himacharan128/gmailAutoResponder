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
const labelName = "Vacation Auto-Reply";

app.get("/", async (req, res) => {
  try {
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "userSecret.json"),
      scopes: SCOPES,
    });

    const labelId = await gmailFunctions.createLabel(auth, labelName);

    // Fetch unreplied messages and do something with them
    const unrepliedMessages = await gmailFunctions.getUnrepliedMessages(auth);
    console.log("Unreplied Messages:", unrepliedMessages);

    res.json({ "this is Auth": auth });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
