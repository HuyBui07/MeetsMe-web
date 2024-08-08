import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { User } from "./types";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "defaultSecret"
    );
    const { payload } = await jwtVerify(token, secret);
    const user = { id: payload.id, username: payload.username } as User;
    const headers = new Headers(request.headers)
    headers.set("user", JSON.stringify(user))
    const newRequest = new Request(request.url, {
      headers: headers,
      method: request.method,
      credentials: request.credentials,
    });
    return NextResponse.next({request: newRequest});
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid token: " + error.message },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/api/((?!user).*)",
};
