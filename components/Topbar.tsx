"use client";
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Topbar() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

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
      <div className="text-sm text-gray-700 mr-4">
        {loading ? "Loading..." : `Hi, ${firstName}`}
      </div>
      <button
        onClick={handleLogout}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        disabled={loading}
      >
        Logout
      </button>
    </header>
  );
}
