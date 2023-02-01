/*
These are for when a user signs up for the first time.
*/

// _ after function name because ts threw naming collision errors on import
function getNewUserMsg_(): string {
  const newUserResponses: string[] = [
    "Welcome to FitScript! I'm your personal fitness assistant. I can help you with your fitness goals, whether it's losing weight, gaining muscle, or just getting in shape. I can also help you with your nutrition, and I can even help you find a workout routine that's right for you. Just ask me anything you want to know about fitness!",
    "Hey there! I'm FitScript, your personal fitness assistant. I can help you with your fitness goals, whether it's losing weight, gaining muscle, or just getting in shape. I can also help you with your nutrition, and I can even help you \
    find a workout routine that's right for you. Just ask me anything you want to know about fitness!",
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement;
}

module.exports = getNewUserMsg_;

export {};
