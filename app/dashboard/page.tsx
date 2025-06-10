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
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
          <span className="text-lg text-green-600">Loading...</span>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 tracking-tight">
          Your Applications
        </h1>
      </div>
      <div className="bg-white border border-emerald-200 rounded-xl shadow p-6">
        <ApplicationTable />
      </div>
    </Layout>
  );
}
