require("dotenv").config();
const jwt = require("jsonwebtoken");

import type { Request, Response } from "express";

const WEBSITE_SIGNATURE = process.env.WEBSITE_SIGNATURE;
const JWT_SECRET = process.env.JWT_SECRET;

type SignupHandlerRequest = {
  phone: string;
  firstname: string;
  is_admin: boolean;
};

// TODO: anyone can get a token. Change this so that they have to sign in
// TODO It'll grant them a token WHEN THEY SIGN IN, SO MAKE A TRIP TO THE DATABASE FOR DASHBOARD SECRET
// A token of 1 day. For dashboard use primarily
const getLongToken = async (req: Request, res: Response) => {
  try {
    const header = req.headers["authorization"];

    if (typeof header !== "undefined" && header.split(" ")[0] === "Bearer") {
      const receivedWebsiteSig = Buffer.from(
        header.split(" ")[1],
        "base64"
      ).toString("utf-8");

      if (receivedWebsiteSig !== WEBSITE_SIGNATURE) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized request, not from client",
        });
      }

      const phone = req.query.phone;
      const payload = { phone: phone };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        success: true,
        token: token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = getLongToken;

export {};
