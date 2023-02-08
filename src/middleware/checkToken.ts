require("dotenv").config();
const jwt = require("jsonwebtoken");

import type { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET;

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const phoneValidate = req.query.phone; // Personal header, made this to check if the phone number in the token matches the phone number in the header

  if (
    typeof authHeader !== "undefined" &&
    authHeader.split(" ")[0] === "Bearer"
  ) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error)
        return res
          .status(403)
          .json({ success: false, message: "Invalid token" });

      const decodedPhone = decoded.phone;

      console.log(decodedPhone, phoneValidate);
      if (phoneValidate !== decodedPhone) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthenticated request: 'Phone-Number' header does not match token phone number",
        });
      }

      next();
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }
};

module.exports = checkToken;
export {};
