"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();

  const [error, setError] = useState("");

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username || !password || !confirmPassword) {
      setError("Please input all fields!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password must be the same!");
      return;
    }

    fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {router.push("/authentication/sign-in");
          alert("Sign up successfully!");
        }
        else return response.json();
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
    <section className="flex flex-col h-[100vh] w-full pt-5 justify-center items-center">
      <form onSubmit={handleSignIn} className="w-[30%]">
        <h1 className="text-3xl pb-4">
          Sign Up To <span className="font-bold">MeetsMe</span>
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
        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="text"
          placeholder="Input your password again"
          className="border border-black rounded p-2 w-full mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-black text-white rounded mt-4 w-full h-12"
        >
          Sign Up
        </button>
      </form>
      <Link className="mt-5 hover:underline" href={"/authentication/sign-in"}>Click here to sign in</Link>
    </section>
  );
}
