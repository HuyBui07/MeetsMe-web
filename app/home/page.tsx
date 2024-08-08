import pool from "@/lib/mysql";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import GroupTile from "@/components/GroupTile";
import { GetServerSideProps } from "next";

async function getGroups() {
  let connection;
  const secret = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "defaultSecret"
  );
  const accessToken = cookies().get("accessToken")?.value;
  const { payload } = await jwtVerify(accessToken!, secret);
  const user_id = payload.id;

  try {
    connection = await pool.getConnection();

    const [groups] = (await connection.query(
      "SELECT group_id, `group`.name FROM group_member INNER JOIN `group` ON group_member.group_id = `group`.id WHERE user_id = ?;",
      [user_id]
    )) as any;

    if (groups) {
      const group_list = groups.map((group: any) => ({
        group_id: group.group_id,
        name: group.name,
      }));
      return group_list;
    }
  } catch (error) {
    return [];
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export default async function Page() {
  const groups = await getGroups();

  return (
    <section className="flex flex-row flex-wrap h-[100vh] gap-4 w-full p-10">
      {groups.map((group: any) => (
        <GroupTile
          key={group.group_id}
          groupId={group.group_id}
          name={group.name}
        />
      ))}
    </section>
  );
}
