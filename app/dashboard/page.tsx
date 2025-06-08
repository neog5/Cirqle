"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import ApplicationTable from "@/components/ApplicationTable";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Redirect to login if no user
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gray-950">
        <p className="text-gray-700 text-gray-100 text-lg">Loading...</p>
      </div>
    );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-gray-100 tracking-tight">
          Your Applications
        </h1>
      </div>
      <ApplicationTable />
    </Layout>
  );
}
