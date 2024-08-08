"use client"

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  return <div>hello {username}</div>;
}
