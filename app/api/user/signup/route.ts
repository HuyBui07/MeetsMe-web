import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/mysql";

export async function POST(req: NextRequest) {
  try {
    // Get the user data from the request
    const body = await req.json();
    const username = body.username;
    const password = body.password;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Establish a connection to the database
    const connection = await pool.getConnection();
    
    // Check existed username
    const rows = await connection.query("SELECT * FROM User WHERE username = ?", [username]);

    if (rows.length > 0) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    // Insert user
    await connection.query("INSERT INTO User (username, password) VALUES (?, ?)", [username, hashedPassword]);
    return NextResponse.json({ message: "User created" }, { status: 201 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
