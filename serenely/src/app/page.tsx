import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">Serenely</h1>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}