"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import ApplicationTable from "@/components/ApplicationTable";

export default function SharedPage() {
  const [status, setStatus] = useState<
    "loading" | "accepted" | "declined" | "pending" | "unauthorized"
  >("loading");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const { shared_id } = useParams();

  useEffect(() => {
    const loadInviteStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("unauthorized");
        return;
      }

      setEmail(user.email || "");

      const { data: list, error: listError } = await supabase
        .from("shared_lists")
        .select("id")
        .eq("shared_id", shared_id)
        .single();

      if (!list || listError) {
        console.error("Error fetching shared list:", listError);
        setStatus("unauthorized");
        return;
      }

      const { data: invite, error: inviteError } = await supabase
        .from("shared_list_invites")
        .select("status")
        .eq("shared_list_id", list.id)
        .eq("invitee_email", user.email)
        .single();

      if (!invite || inviteError) {
        console.error("Error fetching invite status:", inviteError);
        setStatus("unauthorized");
        return;
      }

      if (invite.status === "accepted") {
        setStatus("accepted");
      } else if (invite.status === "declined") {
        setStatus("declined");
      } else if (invite.status === "pending") {
        setStatus("pending");
      }
    };

    loadInviteStatus();
  }, [shared_id]);

  async function handleAction(decision: "accepted" | "declined") {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error("User not authenticated:", userError);
      return;
    }

    const { data: list, error: listError } = await supabase
      .from("shared_lists")
      .select("id")
      .eq("shared_id", shared_id)
      .single();

    if (!list || listError) {
      console.error("Error fetching shared list:", listError);
      return;
    }

    const { data: invite, error: inviteError } = await supabase
      .from("shared_list_invites")
      .update({ status: decision })
      .eq("shared_list_id", list.id)
      .eq("invitee_email", user.email)
      .single();

    if (inviteError) {
      console.error("Error updating invite status:", inviteError);
      return;
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthorized") return <p>Access denied.</p>;
  if (status === "declined") return <p>You declined this invite.</p>;

  if (status === "pending") {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">
            You've been invited to view a shared list.
          </h1>
          <button
            onClick={() => handleAction("accepted")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
      </Layout>
    );
  }

  if (status === "accepted") {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Shared Job List</h1>
          {/* TODO: Render actual shared data here */}
          <p className="text-gray-600">
            This is where the job applications will show.
          </p>
          {shared_id && (
            <ApplicationTable
              isSharedPage={true}
              sharedId={Array.isArray(shared_id) ? shared_id[0] : shared_id}
            />
          )}
        </div>
      </Layout>
    );
  }
  return <p>Unknown status.</p>;
}
