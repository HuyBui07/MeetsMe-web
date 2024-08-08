"use client";

import { useSelector } from "react-redux";
import { MdAccountCircle } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { RootState } from "../../redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = useSelector((state: RootState) => state.user.username);

  return (
    <section>
      <nav className="h-14 w-full bg-black flex flex-row items-center p-5 justify-between">
        <div className="flex flex-row items-center gap-4">
          <MdAccountCircle color="white" size={35} />
          <span className="text-white">{username}</span>
        </div>
        <IoIosNotifications color="white" size={35}/>
      </nav>

      {children}
    </section>
  );
}
