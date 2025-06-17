"use client";
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push("/login"); // Redirect to login page after logout
    }
  };

  return (
    <header className="h-16 bg-white border-b border-emerald-200 px-4 flex items-center justify-end transition-colors">
      <div className="text-sm text-gray-700 mr-4">Hi, User</div>
      <button
        onClick={handleLogout}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
