/*
This allows the admins to invite people with /invite <phone number>, in form +1XXXXXXXXXX
*/

const respondTwilioSMS = require("../../functions/respondTwilioSMS");
const sendTwilioSMS = require("../../functions/sendTwilioSMS");
const getNewUserMsg = require("../signup/newUser");

type adminResponse = {
  success: boolean;
  message?: string;
};

// Returns true if the user was invited, false if not
async function inviteUser_(res: any, message: string): Promise<adminResponse> {
  if (message.startsWith("/invite")) {
    const phoneNumber = message.split(" ")[1];
    if (
      phoneNumber &&
      phoneNumber.startsWith("+") &&
      phoneNumber[1] === "1" && // From the US
      phoneNumber.length === 12
    ) {
      // Add to database

      const newUserMsg = getNewUserMsg();
      sendTwilioSMS(newUserMsg, phoneNumber);

      return { success: true };
    } else {
      return { success: false, message: "Error inviting user" };
    }
  }

  return { success: false };
}

// _ after function name because ts threw naming collision errors on import
module.exports = inviteUser_;

export {};
