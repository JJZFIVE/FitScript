import type { Request } from "express";
type RequestToken = Request & { token?: string; phone?: string };

export type { RequestToken };
