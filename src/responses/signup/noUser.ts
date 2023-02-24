/*
These are for when a user signs up for the first time.
*/
require("dotenv").config();
const WEBSITE_URL = process.env.WEBSITE_URL;

// _ after function name because ts threw naming collision errors on import
function getNoUserMsg_(): string {
  const newUserResponses: string[] = [
    `Hi there! I don't recognize your number. Sign up through the FitScript website to get started! \n\n ${WEBSITE_URL}`,
    `Hey there! I don't think I have your number. Sign up through the FitScript website so we can start chatting! \n\n ${WEBSITE_URL}`,
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement;
}

module.exports = getNoUserMsg_;

export {};
