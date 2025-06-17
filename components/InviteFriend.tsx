"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InviteFriend({
  sharedListId,
  ownerEmail,
  onInviteSuccess,
}: {
  sharedListId: string;
  ownerEmail: string;
  onInviteSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "duplicate"
  >("idle");

  const handleInvite = async () => {
    const supabase = createClient();
    if (!sharedListId) {
      setStatus("error");
      return;
    }
    if (email.trim().toLowerCase() === ownerEmail.trim().toLowerCase()) {
      setStatus("error");
      return;
    }
    setLoading(true);

    // Check for existing invite
    const { data: existing, error: fetchError } = await supabase
      .from("shared_list_invites")
      .select("id")
      .eq("shared_list_id", sharedListId)
      .eq("invitee_email", email)
      .single();

    if (existing) {
      setStatus("duplicate");
      setLoading(false);
      return;
    }

    if (fetchError && fetchError.code !== "PGRST116") {
      // Only treat as error if not "No rows found"
      console.error("Error checking existing invite:", fetchError);
      setStatus("error");
      setLoading(false);
      return;
    }

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
      if (onInviteSuccess) onInviteSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-white border border-emerald-200 rounded-xl shadow p-6 max-w-md mx-auto">
      <label
        className="block text-green-700 font-semibold mb-1"
        htmlFor="invite-email"
      >
        Invite a Friend
      </label>
      <div className="flex gap-2">
        <input
          id="invite-email"
          type="email"
          value={email}
          placeholder="Enter friend's email"
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          className="flex-1 px-3 py-2 border border-green-200 rounded-lg bg-green-50 text-gray-900 focus:outline-none focus:border-green-600 transition"
        />
        <button
          onClick={handleInvite}
          disabled={
            loading ||
            !email ||
            !sharedListId ||
            email.trim().toLowerCase() === ownerEmail.trim().toLowerCase()
          }
          className={`px-4 py-2 rounded-lg font-semibold transition
            ${
              loading ||
              !email ||
              !sharedListId ||
              email.trim().toLowerCase() === ownerEmail.trim().toLowerCase()
                ? "bg-emerald-300 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-green-600 font-medium mt-2">Invite sent!</p>
      )}
      {status === "duplicate" && (
        <p className="text-yellow-600 font-medium mt-2">
          Invite already sent to this email.
        </p>
      )}
      {status === "error" &&
        email.trim().toLowerCase() === ownerEmail.trim().toLowerCase() && (
          <p className="text-red-600 font-medium mt-2">
            You cannot invite yourself.
          </p>
        )}
      {status === "error" &&
        email.trim().toLowerCase() !== ownerEmail.trim().toLowerCase() && (
          <p className="text-red-600 font-medium mt-2">Error sending invite.</p>
        )}
    </div>
  );
}
