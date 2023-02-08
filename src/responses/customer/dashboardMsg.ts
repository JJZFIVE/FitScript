require("dotenv").config();
import type { Customer } from "../../types/db";

/*
These are for when a user signs up for the first time.
*/

const WEBSITE_URL = process.env.WEBSITE_URL;

// _ after function name because ts threw naming collision errors on import
function getDashboardMsg_(client: any, customer: Customer): string {
  const newUserResponses: string[] = [
    `Here's your dashboard. \n\n Your sign in code is: ${customer.benchmark_page_secret_code} \n\n ${WEBSITE_URL}/dashboard/${customer.benchmark_page_prettier_id}`,
    `Sure! Here's the link to your dashboard \n\n Your sign in code is: ${customer.benchmark_page_secret_code} \n\n ${WEBSITE_URL}/dashboard/${customer.benchmark_page_prettier_id}`,
    `Your dashboard? Coming right up... \n\n Your sign in code is: ${customer.benchmark_page_secret_code} \n\n ${WEBSITE_URL}/dashboard/${customer.benchmark_page_prettier_id}`,
    `Sure thing! Here's your dashboard \n\n Your sign in code is: ${customer.benchmark_page_secret_code} \n\n ${WEBSITE_URL}/dashboard/${customer.benchmark_page_prettier_id}`,
  ];

  const randomElement =
    newUserResponses[Math.floor(Math.random() * newUserResponses.length)];
  return randomElement;
}

module.exports = getDashboardMsg_;

export {};
