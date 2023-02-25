require("dotenv").config();
import type { Customer } from "../../types/db";

/*
These are for when a user signs up for the first time.
*/

const WEBSITE_URL = process.env.WEBSITE_URL;

// _ after function name because ts threw naming collision errors on import
function getPremiumMsg(customer: Customer): string {
  const newUserResponses: string[] = [
    `So you're interested in upgrading to FitScript Premium? Follow this link to learn more! \n\n ${WEBSITE_URL}/premium`,
    `Follow this link to get more info about FitScript Premium for a more personalized, data-driven workout experience! \n\n ${WEBSITE_URL}/premium`,
    `With FitScript Premium, you gain access to personalized weight and rep recommendations, and you get unlimited queries every day. Click here to learn more! \n\n ${WEBSITE_URL}/premium`,
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement;
}

module.exports = getPremiumMsg;

export {};
