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

interface ApplicationTableProps {
  isSharedPage?: boolean;
  sharedId?: string;
}

export default function ApplicationTable({
  isSharedPage = false,
  sharedId = "",
}: ApplicationTableProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Application | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [owner_id, setOwnerId] = useState<string | null>(null);

  // 1. Set owner_id as before
  useEffect(() => {
    const getOwnerId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (isSharedPage) {
        const { data: ownerData } = await supabase
          .from("shared_lists")
          .select("owner_id")
          .eq("shared_id", sharedId)
          .single();

        if (!ownerData || !ownerData.owner_id) {
          console.error("Shared list not found or invalid sharedId");
          return;
        }
        setOwnerId(ownerData.owner_id);
      } else {
        setOwnerId(user.id);
      }
    };
    getOwnerId();
  }, [isSharedPage, sharedId]);

  // 2. Fetch applications only when owner_id is set
  const fetchApplications = async () => {
    if (!owner_id) return;
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", owner_id)
      .order("applied_at", { ascending: true });

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data as Application[]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [owner_id]);

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
    if (isSharedPage) {
      // If it's a shared page, we should not allow deletion
      console.warn("Deletion is not allowed on shared pages.");
      return;
    }
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
    if (isSharedPage) {
      // If it's a shared page, we should not allow submission
      console.warn("Submission is not allowed on shared pages.");
      return;
    }
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
    application_url: (value) =>
      typeof value === "string" && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
          title={value}
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
        </a>
      ) : null,
    resume_url: (value) =>
      typeof value === "string" && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
          title={value}
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
        </a>
      ) : null,
  };

  return (
    <div className="bg-white border border-emerald-200 rounded-xl shadow p-6">
      {!isSharedPage && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            + Add Application
          </button>
        </div>
      )}
      <table className="min-w-full mt-4 table-auto border-collapse">
        <thead className="bg-emerald-100">
          <tr className="border-b-2 border-emerald-300">
            <th className="px-4 py-3 text-green-700 font-semibold rounded-tl-lg">
              Sr No.
            </th>
            {visibleHeaders.map((header, idx) => (
              <th
                key={header}
                className={`px-4 py-3 text-green-700 font-semibold ${
                  idx === visibleHeaders.length - 1 && !isSharedPage ? "" : ""
                }`}
              >
                {headerLabels[header] ||
                  header
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
              </th>
            ))}
            {!isSharedPage && (
              <th className="px-4 py-3 text-green-700 font-semibold rounded-tr-lg">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td
                colSpan={visibleHeaders.length + (isSharedPage ? 1 : 2)}
                className="px-4 py-8 text-center text-emerald-400"
              >
                No applications found.
              </td>
            </tr>
          ) : (
            applications.map((app: Application, index: number) => (
              <tr
                key={app.id}
                className="even:bg-green-50 hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                {visibleHeaders.map((header) => {
                  const key = header as keyof Application;
                  const render = columnRenderMap[key];
                  const value = app[key];
                  return (
                    <td
                      key={`${app.id}-${key}`}
                      className="px-4 py-3 text-gray-900"
                    >
                      {render ? render(value as never) : value}
                    </td>
                  );
                })}
                {!isSharedPage && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      className="text-green-600 hover:text-green-700 hover:underline font-medium transition"
                      onClick={() => handleEdit(app)}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 inline"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      className="ml-2 text-red-600 hover:text-red-800 hover:underline font-medium transition"
                      onClick={() => {
                        setDeleteTarget(app);
                        setShowDeleteConfirm(true);
                      }}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 inline"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
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
          <div className="bg-white border border-emerald-200 rounded-xl shadow-xl p-6 w-full max-w-xs text-center">
            <h2 className="text-lg font-semibold mb-4 text-emerald-900">
              Are you sure?
            </h2>
            <p className="mb-6 text-emerald-700">
              Do you really want to delete this application?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200"
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
