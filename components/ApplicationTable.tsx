"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import AddApplicationModal from "./AddApplicationModal";

type Application = {
  id: number;
  role: string;
  company: string;
  platform: string;
  application_url: string;
  resume_url: string;
  status: string;
  applied_at: string;
  notes: string;
};

export default function ApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Application | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const fetchApplications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("applied_at", { ascending: true });

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data as Application[]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAdd = () => {
    setMode("add");
    setInitialData(null);
    setModalOpen(true);
  };

  const handleEdit = (app: Application) => {
    setMode("edit");
    setInitialData(app);
    setModalOpen(true);
  };

  const handleDelete = async (app: Application) => {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", app.id);

    if (error) {
      console.error("Error deleting application:", error);
    } else {
      setApplications((prev) =>
        prev.filter((application) => application.id !== app.id)
      );
    }
  };

  const handleSubmit = async (form: Partial<Application>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (mode === "add") {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          ...form,
          user_id: user.id,
          applied_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding application:", error);
      } else {
        setApplications((prev) => [...prev, data as Application]);
      }
    } else if (mode === "edit" && initialData) {
      const { data, error } = await supabase
        .from("applications")
        .update({ ...form })
        .eq("id", initialData.id)
        .select()
        .single();
      if (error) {
        console.error("Error updating application:", error);
      }

      await fetchApplications(); // Refresh the list after edit
    }
  };

  const visibleHeaders: (keyof Application)[] = [
    "role",
    "company",
    "platform",
    "application_url",
    "status",
    "applied_at",
    "resume_url",
  ];

  const headerLabels: Record<string, string> = {
    role: "Role",
    company: "Company",
    platform: "Platform",
    application_url: "App Link",
    status: "Status",
    applied_at: "Applied At",
    resume_url: "Resume Link",
  };

  const statusColorMap: Record<string, { bg: string; text: string }> = {
    Applied: { bg: "bg-blue-100", text: "text-blue-800" },
    Interview: { bg: "bg-green-100", text: "text-green-800" },
    Rejected: { bg: "bg-red-100", text: "text-red-800" },
    Offer: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Default: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  const columnRenderMap: {
    [K in keyof Application]?: (value: Application[K]) => React.ReactNode;
  } = {
    status: (value) => {
      const colorObj =
        statusColorMap[value as string] || statusColorMap.Default;
      return (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colorObj.bg} ${colorObj.text}`}
        >
          {value}
        </span>
      );
    },
    applied_at: (value) =>
      typeof value === "string" ? value.slice(0, 10) : "",
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 shadow">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition"
        >
          + Add Application
        </button>
      </div>
      <table className="min-w-full mt-4 table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 text-gray-700">Sr No.</th>
            {visibleHeaders.map((header) => (
              <th key={header} className="px-4 py-2 text-gray-700">
                {headerLabels[header] ||
                  header
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
              </th>
            ))}
            <th key={"actions"} className="px-4 py-2 text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app: Application, index: number) => (
            <tr key={app.id} className="hover:bg-gray-100 even:bg-gray-50">
              <td className="px-4 py-2 text-gray-900">{index + 1}</td>
              {visibleHeaders.map((header) => {
                const key = header as keyof Application;
                const render = columnRenderMap[key];
                const value = app[key];
                return (
                  <td
                    key={`${app.id}-${key}`}
                    className="px-4 py-2 text-gray-900"
                  >
                    {render ? render(value as never) : value}
                  </td>
                );
              })}
              <td className="px-4 py-2">
                <button
                  className="text-emerald-600 hover:underline hover:cursor-pointer font-medium"
                  onClick={() => handleEdit(app)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 text-red-600 hover:underline font-medium"
                  onClick={() => {
                    setDeleteTarget(app);
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={initialData}
        mode={mode}
      />
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-xs text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Are you sure?
            </h2>
            <p className="mb-6 text-gray-700">
              Do you really want to delete this application?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  await handleDelete(deleteTarget);
                  setShowDeleteConfirm(false);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
