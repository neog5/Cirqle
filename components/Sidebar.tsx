import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white bg-gray-900 border-r border-gray-200 border-gray-800 hidden md:block shadow-sm transition-colors">
      <div className="p-4 font-bold text-2xl text-emerald-600 text-emerald-400 tracking-tight">
        Cirqle
      </div>
      <nav className="flex flex-col gap-2 px-4">
        <Link
          href="/dashboard"
          className="text-slate-700 text-gray-100 hover:text-emerald-600 hover:text-emerald-400 font-medium py-2 px-2 rounded transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/share/manage"
          className="text-slate-700 text-gray-100 hover:text-emerald-600 hover:text-emerald-400 font-medium py-2 px-2 rounded transition-colors"
        >
          Manage my list
        </Link>
        <Link
          href="/shared-with-me"
          className="text-slate-700 text-gray-100 hover:text-emerald-600 hover:text-emerald-400 font-medium py-2 px-2 rounded transition-colors"
        >
          Check Friends
        </Link>
        <Link
          href="/settings"
          className="text-slate-700 text-gray-100 hover:text-emerald-600 hover:text-emerald-400 font-medium py-2 px-2 rounded transition-colors"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
