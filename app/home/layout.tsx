"use client";

import { useSearchParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  return (
    <section>
      <nav className="h-14 w-full bg-black">
        <div>
          <span className="text-white">{username}</span>
        </div>
      </nav>

      {children}
    </section>
  );
}
