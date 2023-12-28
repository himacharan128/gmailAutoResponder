# AutoResponder for Gmail

This Node.js application automatically responds to unreplied emails in your Gmail inbox while you're on vacation.

## Introduction

This Node.js application uses the Gmail API to check for new emails in your Gmail inbox, identify unreplied emails, and automatically respond with a predefined message. It also adds a label to the email and moves it to the labeled category. The application repeats this process in random intervals, simulating a vacation auto-responder.

## Prerequisites

Before using this application, ensure you have the following:

- Node.js installed on your machine
- A Gmail account
- [Google Cloud Platform project](https://console.cloud.google.com/) with the Gmail API enabled
- API credentials in JSON format ([Create credentials](https://console.cloud.google.com/apis/credentials))

## Installation

1. Clone this repository to your local machine:

   ```bash
     git clone https://github.com/himacharan128/gmailAutoResponder.git
     cd gmailAutoResponder
   ```
2. Install dependencies:
   ```bash
     npm install
   ```
3. Configure Gmail API:
- Enable the Gmail API and download the credentials.json file from the Google Cloud Console.
- Save the credentials.json file in the project directory.
4. Create userSecret.json:
Create a userSecret.json file in the project directory with the following structure:
   ```bash
     {
    "installed": {
      "client_id": "<YOUR_CLIENT_ID>",
      "client_secret": "<YOUR_CLIENT_SECRET>",
      "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
      }
    }
   ```
## Usage

Run the application with the following command:
  ```bash
    npm start
  ```
Visit http://localhost:8080 in your browser to authenticate and start the auto-responder.
## Configuration

Adjust the following variables in app.js to customize the behavior:
- LabelName: The label name for auto-replied emails.
- SCOPES: Gmail API scopes for authentication.

## File Structure
- app.js: Main application file with the server setup and Gmail API integration.
- gmailFunctions.js: Module containing functions for interacting with the Gmail API.
- userSecret.json: JSON file containing your OAuth 2.0 client credentials.

## Notes
- The app processes unreplied emails at random intervals to simulate a real-time vacation response.
- Auto-reply message content can be customized in the sendAutoReply function.
