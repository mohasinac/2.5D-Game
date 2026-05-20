import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🎮 Beyblade Game Server
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Administration & Game Management Portal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Panel Card */}
          <Link
            href="/admin"
            className="block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Panel
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage beyblades, stadiums, and game settings
              </p>
            </div>
          </Link>

          {/* Server Monitor Card */}
          <a
            href="/colyseus"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Server Monitor
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                View active rooms and server statistics
              </p>
            </div>
          </a>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Server Status</h3>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 dark:text-gray-300">Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
