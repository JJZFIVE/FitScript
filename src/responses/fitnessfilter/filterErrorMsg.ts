/*
These are for when the user doesn't specify something about fitness in their message.
*/

// _ after function name because ts threw naming collision errors on import
function getFilterErrorMsg_(): string {
  const filterErrorMsgResponses: string[] = [
    "As a fitness bot, I can only talk about working out. Try asking me something fitness related!",
    "Let's talk about fitness! Please stay on topic and ask me questions about working out!",
    "I'm here to help you with your fitness goals, so please stick to that topic when talking to me!",
    "Time to focus on fitness! Ask me anything you want to know about working out!",
    "I'm only here to talk about fitness and working out, so let's keep the conversation focused!",
    "I'm not equipped to answer that. What questions do you have about fitness?",
    "Let's chat about working out! What do you want to know about fitness?",
    "I'm here to help you with your fitness journey. Let's focus on that, ok?",
    "I'm a fitness bot, so let's talk about working out and getting in shape!",
    "I'm here to help you reach your fitness goals. Please ask me about working out!",
  ];

  const randomElement =
    filterErrorMsgResponses[
      Math.floor(Math.random() * filterErrorMsgResponses.length)
    ];
  return randomElement;
}

module.exports = getFilterErrorMsg_;
