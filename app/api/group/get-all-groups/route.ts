import { NextResponse } from "next/server";
import { CustomNextRequest } from "@/types";
import pool from "@/lib/mysql";

export async function GET(request: CustomNextRequest) {
  let connection;
  const user_id = request.user.id;
  console.log(user_id)

  try {
    connection = await pool.getConnection();

    const [groups] = (await connection.query(
      "SELECT group_id, `group`.name FROM group_member INNER JOIN `group` ON group_member.group_id = `group`.id WHERE user_id = ?;",
      [user_id]
    )) as any;

    if (groups) {
        const group_list = groups.map((group: any) => ({
            "group_id": group.id,
            "name": group.name
        }))
        console.log(group_list)
        return NextResponse.json(group_list, {status: 200})
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
