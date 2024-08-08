"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUsername } from "@/redux/userSlice";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setError("Please input all fields!");
      return;
    }

    fetch("/api/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          router.push("/home");
          dispatch(setUsername(username));
        } else return response.json();
      })
      .then((data: Error) => {
        if (data) {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <section className="flex flex-col h-[100vh] w-full justify-center items-center">
      <form onSubmit={handleSignIn} className="w-[30%]">
        <h1 className="text-3xl pb-4">
          Sign In To <span className="font-bold">MeetsMe</span>
        </h1>
        <label>Username</label>
        <input
          name="username"
          type="text"
          placeholder="Input your username"
          className="border border-black rounded p-2 w-full mb-4"
        />
        <label>Password</label>
        <input
          name="password"
          type="text"
          placeholder="Input your password"
          className="border border-black rounded p-2 w-full mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-black text-white rounded mt-4 w-full h-12"
        >
          Sign In
        </button>
      </form>
      <Link className="mt-5 hover:underline" href={"/authentication/sign-up"}>
        Click here to sign up
      </Link>
    </section>
  );
}
