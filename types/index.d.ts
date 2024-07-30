import { NextRequest } from "next/server";

export interface CustomNextRequest extends NextRequest {
  user?: any;
}
