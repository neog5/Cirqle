"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function InviteFriend({
  sharedListId,
}: {
  sharedListId: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleInvite() {
    setLoading(true);
    const { error } = await supabase.from("shared_list_invites").insert({
      shared_list_id: sharedListId,
      invitee_email: email,
      status: "pending",
    });

    if (error) {
      console.error("Error inviting friend:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        value={email}
        placeholder="Enter friend's email"
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={handleInvite}
        disabled={loading || !email}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Invite"}
      </button>

      {status === "success" && <p className="text-green-600">Invite sent!</p>}
      {status === "error" && (
        <p className="text-red-600">Error sending invite.</p>
      )}
    </div>
  );
}
