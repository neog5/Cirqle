"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Redirect to login if no session
      } else {
        router.push("/dashboard"); // Redirect to dashboard if session exists
      }
    };
    checkSession();
  }, [router]);
  return null; // No UI needed, just redirecting
}
