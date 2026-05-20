import Link from "next/link";

export default function AdminPage() {
  const sections = [
    {
      title: "Beyblades",
      description: "Manage beyblade stats, abilities, and properties",
      icon: "🌀",
      href: "/admin/beyblades",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Stadiums",
      description: "Create and manage arena configurations",
      icon: "🏟️",
      href: "/admin/stadiums",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Game Stats",
      description: "View game statistics and analytics",
      icon: "📊",
      href: "/admin/stats",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Arenas",
      description: "Legacy arena management",
      icon: "⚔️",
      href: "/admin/arenas",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Settings",
      description: "Game configuration and settings",
      icon: "⚙️",
      href: "/admin/settings",
      color: "from-gray-500 to-slate-500",
    },
    {
      title: "Arena Test",
      description: "Test arena configurations",
      icon: "🧪",
      href: "/admin/arena-test",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Game Admin Panel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage all aspects of the Beyblade game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="p-8">
                <div className="text-5xl mb-4">{section.icon}</div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400">
                  {section.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
