"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push("/login"); // Redirect to login page after logout
    }
  };

  return (
    <header className="h-16 bg-white bg-gray-900 border-b border-gray-200 border-gray-800 px-4 flex items-center justify-end transition-colors">
      <div className="text-sm text-slate-600 text-gray-300 mr-4">Hi, Het</div>
      <button
        onClick={handleLogout}
        className="bg-emerald-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2 rounded transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
