"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Layout } from "@/components/Layout";

export default function ProfilePage() {
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setMessage("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Error saving profile.");
    } else {
      setMessage("Profile updated successfully!");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-green-600 text-lg font-semibold">Loading...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-green-700 mb-10 text-left">
        Edit Profile
      </h1>
      <div className="space-y-7 max-w-lg w-full mx-0 text-left">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 min-w-[140px] max-w-[220px]">
            <label
              className="block text-green-700 font-semibold mb-1 text-left"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900 text-left"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[140px] max-w-[220px]">
            <label
              className="block text-green-700 font-semibold mb-1 text-left"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900 text-left"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 ml-0 block w-fit text-left"
        >
          Save
        </button>
        {message && (
          <p
            className={`mt-3 text-left text-sm font-medium ${
              message.includes("Error")
                ? "text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2"
                : "text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </Layout>
  );
}
