"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
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

    const { error: inviteError } = await supabase
      .from("shared_list_invites")
      .update({ status: decision })
      .eq("shared_list_id", list.id)
      .eq("invitee_email", user.email)
      .single();

    if (inviteError) {
      console.error("Error updating invite status:", inviteError);
      return;
    }

    setStatus(decision);
  }

  if (status === "loading")
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
          <span className="text-lg text-green-600">Loading...</span>
        </div>
      </Layout>
    );
  if (status === "unauthorized")
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
          <div className="bg-white border border-red-200 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-700">
              You are not authorized to view this shared list.
            </p>
          </div>
        </div>
      </Layout>
    );
  if (status === "declined")
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
          <div className="bg-white border border-yellow-200 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              Invite Declined
            </h2>
            <p className="text-gray-700">You declined this invite.</p>
          </div>
        </div>
      </Layout>
    );

  if (status === "pending") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
          <div className="bg-white border border-emerald-200 rounded-xl shadow-lg p-8 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-green-700 mb-4">
              You've been invited to view a shared list.
            </h1>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => handleAction("accepted")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("declined")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === "accepted") {
    return (
      <Layout>
        <div className="p-6 space-y-4 max-w-4xl mx-auto bg-white border border-emerald-200 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Shared Job List
          </h1>
          <p className="text-gray-700 mb-4">
            Below is the list of applications shared with you:
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
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <span className="text-lg text-gray-700">Unknown status.</span>
      </div>
    </Layout>
  );
}
