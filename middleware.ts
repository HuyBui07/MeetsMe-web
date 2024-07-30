import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { CustomNextRequest } from "./types";

export function middleware(request: CustomNextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  console.log(token)

  if (!token) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET || "defaultSecret";
    const decoded = jwt.verify(token, secret);
    request.user = decoded; // Attach user info to the request object
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.json({ message: "Invalid token: " + error.message }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/((?!user).*)",
};
