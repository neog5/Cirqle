"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 bg-white transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
