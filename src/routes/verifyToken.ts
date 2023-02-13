require("dotenv").config();
const jwt = require("jsonwebtoken");

import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

// A token of 1 day. For dashboard use primarily
const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.token;

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized request, invalid token",
        });
      }

      const decodedPhone = decoded.phone;

      return res.status(200).json({
        success: true,
        message: "Valid token",
        decodedPhone: decodedPhone,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyToken;

export {};
