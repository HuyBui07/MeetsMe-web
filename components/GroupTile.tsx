"use client"

import { useRouter } from "next/navigation";

export default function GroupTile({
  groupId,
  name,
}: {
  groupId: number;
  name: string;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/home/${groupId}`)}
      className="h-20 w-60 border-2 rounded-lg border-black bg-white justify-center items-center flex hover:bg-gray-500"
    >
      <h1 className="font-bold">{name}</h1>
    </div>
  );
}
