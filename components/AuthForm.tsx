"use client";
export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately if already logged in
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.log("Already signed in:", session.user);
        router.push("/dashboard");
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user);
        router.push("/dashboard"); // Redirect to dashboard page on sign in
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      //   theme="dark"
      providers={["google"]}
      view="sign_in"
    />
  );
}
