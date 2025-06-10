import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-emerald-200 hidden md:block shadow-sm transition-colors">
      <div className="p-4 font-bold text-2xl text-green-700 tracking-tight">
        Cirqle
      </div>
      <nav className="flex flex-col gap-2 px-4">
        <Link
          href="/dashboard"
          className="text-gray-700 hover:text-green-600 font-medium py-2 px-2 rounded transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/share/manage"
          className="text-gray-700 hover:text-green-600 font-medium py-2 px-2 rounded transition-colors"
        >
          Manage my list
        </Link>
        <Link
          href="/shared-with-me"
          className="text-gray-700 hover:text-green-600 font-medium py-2 px-2 rounded transition-colors"
        >
          Check Friends
        </Link>
        <Link
          href="/settings"
          className="text-gray-700 hover:text-green-600 font-medium py-2 px-2 rounded transition-colors"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
