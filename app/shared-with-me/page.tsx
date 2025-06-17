"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";

export default function SharedWithMePage() {
  const [sharedLists, setSharedLists] = useState<
    {
      status: string;
      shared_id: string;
      owner_id: string;
      owner_email: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const fetchSharedLists = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        router.push("/login"); // Redirect to login if no user
        return;
      }

      const { data, error } = await supabase.rpc("get_shared_lists_for_user", {
        input_email: user.email,
      });

      if (error) {
        console.error("Error fetching shared lists:", error);
        setLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        setSharedLists([]);
        setLoading(false);
        return;
      }

      setSharedLists(data);
      setLoading(false);
    };
    fetchSharedLists();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 tracking-tight">
          Shared with Me
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] bg-gray-50">
          <span className="text-lg text-green-600">Loading...</span>
        </div>
      ) : sharedLists.length === 0 ? (
        <div className="text-gray-700 text-center mt-10">
          No shared lists found.
        </div>
      ) : (
        <div className="mt-6">
          <table className="min-w-full bg-white border border-emerald-200 rounded-xl shadow">
            <thead className="bg-emerald-100">
              <tr>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">
                  Owner Email
                </th>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">
                  Link
                </th>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sharedLists.map((item, idx) => (
                <tr
                  key={item.shared_id || idx}
                  className="even:bg-green-50 hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {item.owner_email || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/share/${item.shared_id}`}
                      className="inline-flex items-center gap-1 text-lime-600 hover:text-green-600 hover:underline font-medium transition"
                      title="Open Shared List"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
                      <span className="sr-only">Open Shared List</span>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.status === "accepted"
                          ? "bg-emerald-500/10 text-green-700 px-3 py-1 rounded-full font-semibold"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-semibold"
                          : "bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold"
                      }
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
