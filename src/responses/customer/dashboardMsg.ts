require("dotenv").config();
import type { Customer } from "../../types/db";

/*
These are for when a user signs up for the first time.
*/

const WEBSITE_URL = process.env.WEBSITE_URL;

// _ after function name because ts threw naming collision errors on import
function getDashboardMsg_(customer: Customer): string {
  const newUserResponses: string[] = [
    `Here's your dashboard. \n\n Your sign in code is: ${customer.dashboard_secret} \n\n ${WEBSITE_URL}/dashboard/${customer.phone}`,
    `Sure! Here's the link to your dashboard \n\n Your sign in code is: ${customer.dashboard_secret} \n\n ${WEBSITE_URL}/dashboard/${customer.phone}`,
    `Your dashboard? Coming right up... \n\n Your sign in code is: ${customer.dashboard_secret} \n\n ${WEBSITE_URL}/dashboard/${customer.phone}`,
    `Sure thing! Here's your dashboard \n\n Your sign in code is: ${customer.dashboard_secret} \n\n ${WEBSITE_URL}/dashboard/${customer.phone}`,
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement;
}

module.exports = getDashboardMsg_;

export {};
