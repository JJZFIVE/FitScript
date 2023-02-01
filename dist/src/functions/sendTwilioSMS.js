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
function sendTwilioSMS_(message, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Return specific twilio XML response
        const twiml = new MessagingResponse();
        twiml.message(message);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    });
}
module.exports = sendTwilioSMS_;
//# sourceMappingURL=sendTwilioSMS.js.map