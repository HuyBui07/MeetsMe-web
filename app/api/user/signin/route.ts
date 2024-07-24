import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/mysql";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
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
        const accessToken = jwt.sign(
          { id: user.id, username: user.username },
          secret,
          { expiresIn: "1d" }
        );
        
        // Create a NextResponse object
        const response = NextResponse.next()
        // Set the httpOnly cookies
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60
        })
      }
    } else {
      return NextResponse.json(
        { message: "Username does not exist" },
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
