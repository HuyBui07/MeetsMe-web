import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/mysql";
import { JWTPayload, SignJWT } from "jose";
import { cookies } from "next/headers";

async function createToken(
  payload: JWTPayload,
  secret: string
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
  return token;
}

export async function POST(req: NextRequest, res: NextResponse) {
  let connection;
  try {
    // Get the user data from the request
    const body = await req.json();
    const username = body.username;
    const password = body.password;

    // Establish a connection to the database
    connection = await pool.getConnection();

    // Check existed username
    const [rows] = (await connection.query(
      "SELECT * FROM User WHERE username = ?",
      [username]
    )) as any;

    if (rows.length > 0) {
      const user = rows[0];
      const hashedPassword = user.password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (isPasswordValid) {
        const secret = process.env.NEXTAUTH_SECRET || "defaultSecret";
        const payload = { id: user.id, username: user.username };
        const accessToken = await createToken(payload, secret);

        cookies().set({
          name: "accessToken",
          value: accessToken,
          httpOnly: true,
          maxAge: 24 * 60 * 60,
        });

        connection.release();

        return NextResponse.json({ message: "Authenticated" }, { status: 200 });
      }
    } else {
      return NextResponse.json(
        { message: "Username does not exist!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
