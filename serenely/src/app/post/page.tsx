"use client";
import NavBar from "@/components/Navbar";
import { PostList } from "@/components/PostFeature";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PostsPage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen py-8 bg-gray-900">
      <NavBar></NavBar>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-white">Recent Posts</h1>
        <PostList onPostCreated={() => {}} />
      </div>
    </div>
    </ProtectedRoute>
  );
}
