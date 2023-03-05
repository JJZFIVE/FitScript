/*
These are for when a user signs up for the first time.
*/
require("dotenv").config();

// TODO: Add a STOP or HELP feature

// _ after function name because ts threw naming collision errors on import
function getNewUserMsg(firstname: string): string {
  const PRODUCTNAME = "FitScript";
  const websiteUrl = process.env.WEBSITE_URL;

  const HOWTOUSE = `\n\n To update your goal, edit your workout frequency, change your settings, and update your fitness benchmarks, just ask me something like "Let me update my goal" or "Show me my dashboard."\n\nFeel free to share me with your friends simply by having them text this number or by going to ${websiteUrl}.`;

  // Add in V5
  const PREMIUM = `\n\nTo gain access to ${PRODUCTNAME} Premium features such as personalized fitness level tracking, unlimited texts, and an ad-free experience, just ask me something like "upgrade me to premium!"`;

  const newUserResponses: string[] = [
    `Hi ${firstname}, welcome to ${PRODUCTNAME}! 💪\n\nI'm your personal fitness assistant. I can help you with your fitness goals, whether it's losing weight, gaining muscle, or just getting in shape. I can answer any question, big or small, and I can even help you find a workout routine that's right for you. Just ask me anything you want to know about fitness!`,
    `Hey ${firstname}, welcome to ${PRODUCTNAME}! 💪\n\nI'm your personal fitness assistant. I can help you with your fitness goals, whether it's losing weight, gaining muscle, or just getting in shape. I can also help you with your nutrition, and I can even help you find a workout routine that's right for you. Just ask me anything you want to know about fitness!`,
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement + HOWTOUSE;
}

module.exports = getNewUserMsg;

export {};
