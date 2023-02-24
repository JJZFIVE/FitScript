require("dotenv").config();
const jwt = require("jsonwebtoken");

import type { Request, Response } from "express";

const WEBSITE_SIGNATURE = process.env.WEBSITE_SIGNATURE;
const JWT_SECRET = process.env.JWT_SECRET;

// A token of 1 day. For dashboard use primarily
const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const phone = body.phone;
    const password = body.password; // password should be hashed on the server

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

      const payload = { phone: phone };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

      // TODO: CHECK DATABASE FOR PASSWORD

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
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = login;

export {};
