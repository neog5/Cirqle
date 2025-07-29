import { useState, useEffect } from "react";

interface ApplicationData {
  role: string;
  company: string;
  platform: string;
  application_url: string;
  status: string;
  applied_at: string;
  resume_url: string;
  notes?: string; // Optional field for additional notes
}

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationData) => void;
  initialData?: ApplicationData | null;
  mode?: "add" | "edit"; // <-- Add this
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}: AddApplicationModalProps) {
  const [form, setForm] = useState<ApplicationData>({
    role: "",
    company: "",
    platform: "",
    application_url: "",
    status: "Applied",
    applied_at: "",
    resume_url: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // Populate form with initialData when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        role: initialData.role || "",
        company: initialData.company || "",
        platform: initialData.platform || "",
        application_url: initialData.application_url || "",
        status: initialData.status || "Applied",
        applied_at: initialData.applied_at
          ? initialData.applied_at.slice(0, 10) // <-- Convert ISO to YYYY-MM-DD
          : "",
        resume_url: initialData.resume_url || "",
        notes: initialData.notes || "",
      });
    } else if (mode === "add") {
      setForm({
        role: "",
        company: "",
        platform: "",
        application_url: "",
        status: "Applied",
        applied_at: "",
        resume_url: "",
        notes: "",
      });
    }
  }, [initialData, isOpen, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert date to ISO string if needed
    const dataToSend = {
      ...form,
      applied_at: form.applied_at
        ? new Date(form.applied_at).toISOString()
        : "",
    };

    await onSubmit(dataToSend);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="bg-white border border-green-100 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transition-colors max-h-[90vh] flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          {mode === "edit" ? "Edit Application" : "Add Application"}
        </h2>
        <form
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "80vh" }}
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="role"
            >
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="company"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="platform"
            >
              Platform
            </label>
            <input
              id="platform"
              name="platform"
              type="text"
              value={form.platform}
              onChange={handleChange}
              required
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="application_url"
            >
              Application URL
            </label>
            <input
              id="application_url"
              name="application_url"
              type="url"
              value={form.application_url}
              onChange={handleChange}
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="applied_at"
            >
              Applied At
            </label>
            <input
              id="applied_at"
              name="applied_at"
              type="date"
              value={form.applied_at}
              onChange={handleChange}
              required
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="resume_url"
            >
              Resume URL
            </label>
            <input
              id="resume_url"
              name="resume_url"
              type="url"
              value={form.resume_url}
              onChange={handleChange}
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label
              className="block font-semibold mb-1 text-green-700"
              htmlFor="notes"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-3 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900 resize-y"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
