import type { Metadata } from "next";
import React from "react";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard | GoOuty",
  description: "Admin Dashboard",
};

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session?.user?.name || session?.user?.email}!</p>

      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Sign Out
        </button>
      </form>
    </div>
  );
}
