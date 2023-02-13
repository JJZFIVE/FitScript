require("dotenv").config();
const jwt = require("jsonwebtoken");

import type { Response, NextFunction } from "express";
import type { RequestToken } from "../types/ExpressModified";
const JWT_SECRET = process.env.JWT_SECRET;

const checkToken = (req: RequestToken, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

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

      const phone = decoded.phone;

      // Append token and phone to the request object
      req.token = token;
      req.phone = phone;
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
