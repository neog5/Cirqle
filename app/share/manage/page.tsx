"use client";

import InviteFriend from "@/components/InviteFriend";
import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SharePage() {
  const [sharedListId, setSharedListId] = useState<string | null>(null);
  const [internalListId, setInternalListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedListId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch the shared list ID for the user
      const { data: existingList, error } = await supabase
        .from("shared_lists")
        .select("shared_id")
        .eq("owner_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching shared list ID:", error);
        setLoading(false);
        return;
      }

      if (existingList) {
        setSharedListId(existingList.shared_id);
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
        }
      }
      setLoading(false); // <-- Always set loading to false at the end
    };
    loadSharedListId();
  }, []);

  //   const sharedListId = "your-shared-list-id"; // Replace with actual shared list ID logic
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-gray-100 tracking-tight">
          Share Your Applications
        </h1>
      </div>
      <InviteFriend sharedListId={internalListId ?? ""} />
    </Layout>
  );
}
