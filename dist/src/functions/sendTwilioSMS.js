"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
function sendTwilioSMS(to, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.messages.create({
                body: message,
                from: "+13024837626",
                to: to,
            });
            console.log("MESSAGE SENT TO" + to);
            return true;
        }
        catch (error) {
            console.log("MESSAGE NOT SENT", error.message);
            return false;
        }
    });
}
module.exports = sendTwilioSMS;
//# sourceMappingURL=sendTwilioSMS.js.map