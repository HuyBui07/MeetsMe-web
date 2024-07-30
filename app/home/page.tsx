"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("/api/group/get-all-groups", {
      method: "GET",
      credentials: "include", // Include credentials (cookies) in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return <p>Home</p>;
}
