"use strict";
/*
This allows the admins to invite people with /invite <phone number>, in form +1XXXXXXXXXX
*/
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
const sendTwilioSMS = require("../functions/sendTwilioSMS");
// Returns true if the user was invited, false if not
function inviteUser_(res, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.startsWith("/invite")) {
            const phoneNumber = message.split(" ")[1];
            if (phoneNumber &&
                phoneNumber.startsWith("+") &&
                phoneNumber[1] === "1" && // From the US
                phoneNumber.length === 12) {
                // Add to database
                sendTwilioSMS();
                return { success: true };
            }
        }
        return { success: false, message: "Invalid phone number" };
    });
}
// _ after function name because ts threw naming collision errors on import
module.exports = inviteUser_;
//# sourceMappingURL=invite.js.map