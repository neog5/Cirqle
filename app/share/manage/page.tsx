"use client";

import { useState, useEffect } from "react";
import InviteFriend from "@/components/InviteFriend";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";

export default function SharePage() {
  const [sharedListId, setSharedListId] = useState<string | null>(null);
  const [internalListId, setInternalListId] = useState<string | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<
    { id: string; invitee_email: string; status: string }[]
  >([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadSharedListId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      setOwnerEmail(user.email ?? "");

      // Fetch the shared list ID for the user
      const { data: existingList, error } = await supabase
        .from("shared_lists")
        .select("id,shared_id")
        .eq("owner_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching shared list ID:", error);
        setLoading(false);
        return;
      }

      if (existingList) {
        setInternalListId(existingList.id);
        setSharedListId(existingList.shared_id);
        fetchInvites(existingList.id);
      } else {
        // Create a new shared list if it doesn't exist
        const { data: newList, error: createError } = await supabase
          .from("shared_lists")
          .insert({ owner_id: user.id })
          .select("id, shared_id")
          .single();

        if (createError) {
          console.error("Error creating shared list:", createError);
        } else {
          setInternalListId(newList.id);
          setSharedListId(newList.shared_id);
          fetchInvites(newList.id);
        }
      }
      setLoading(false);
    };

    const fetchInvites = async (listId: string) => {
      const { data, error } = await supabase
        .from("shared_list_invites")
        .select("id, invitee_email, status")
        .eq("shared_list_id", listId);

      if (error) {
        console.error("Error fetching invites:", error);
        setInvites([]);
      } else {
        setInvites(data || []);
      }
    };

    loadSharedListId();
    // eslint-disable-next-line
  }, []);

  // Construct the share link
  const shareLink = sharedListId
    ? `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/share/${sharedListId}`
    : "";

  const handleCopy = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
          <span className="text-lg text-green-600">Loading...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 tracking-tight">
          Share Your Applications
        </h1>
      </div>

      {/* Share Link Field */}
      <div className="mb-10">
        <label className="block text-gray-700 font-semibold mb-2">
          Shareable Link
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareLink}
            className="w-full px-3 py-2 border border-green-600 focus:border-green-600 rounded-lg bg-green-50 text-gray-900 font-mono text-sm focus:outline-none transition"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition ${
              !shareLink ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!shareLink}
            type="button"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mb-12">
        <InviteFriend
          sharedListId={internalListId ?? ""}
          ownerEmail={ownerEmail}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-emerald-700">
          Currently Shared With
        </h2>
        <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white shadow">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-100">
              <tr>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invites.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-emerald-400 text-center"
                  >
                    No invites sent yet.
                  </td>
                </tr>
              ) : (
                invites.map((invite) => (
                  <tr key={invite.id} className="even:bg-green-50">
                    <td className="px-4 py-3 text-gray-900">
                      {invite.invitee_email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          invite.status === "accepted"
                            ? "text-green-600 font-semibold"
                            : invite.status === "pending"
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {invite.status.charAt(0).toUpperCase() +
                          invite.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
