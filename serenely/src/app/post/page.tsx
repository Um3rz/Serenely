// File: app/post/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import CreatePostModal from "@/components/PostFeature";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const REACTIONS = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
];

type Post = {
  id: string;
  author: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [commentBoxOpen, setCommentBoxOpen] = useState<Record<string, boolean>>(
    {}
  );
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const username = "Jawad";

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReaction = (postId: string, type: string) => {
    setReactions((prev) => ({ ...prev, [postId]: type }));
    setHoveredReaction(null);
  };

  const handleEdit = async (postId: string) => {
    await fetch(`/api/posts?id=${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedContent }),
    });
    setEditPostId(null);
    fetchPosts();
  };

  const handleDelete = async (postId: string) => {
    await fetch(`/api/posts?id=${postId}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleComment = (postId: string) => {
    const newComment = commentText[postId];
    if (!newComment) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div style={{ backgroundColor: "#0B1623" }} className="min-h-screen py-8">
      <div className="max-w-xl mx-auto p-4">
        <CreatePostModal username={username} onPostCreated={fetchPosts} />
        <h1 className="text-2xl font-bold mt-8 mb-4 text-white">
          Recent Posts
        </h1>

        {loading ? (
          <p className="text-white">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-white">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-500 rounded-lg p-6 mb-6 shadow-sm relative"
              style={{ backgroundColor: "#111827" }}
            >
              <div className="absolute top-4 right-4 text-white cursor-pointer">
                <MoreHorizontal
                  onClick={() =>
                    setDropdownOpen(dropdownOpen === post.id ? null : post.id)
                  }
                />
                {dropdownOpen === post.id && (
                  <div className="absolute top-8 right-0 bg-white rounded shadow text-black text-sm z-10 w-36">
                    <button
                      onClick={() => {
                        setEditedContent(post.content);
                        setEditPostId(post.id);
                        setDropdownOpen(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <Pencil size={14} /> Edit Post
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                      <Trash2 size={14} /> Delete Post
                    </button>
                  </div>
                )}
              </div>

              <h2
                className="text-md font-semibold"
                style={{ color: "#0EB29A" }}
              >
                {post.author}
              </h2>

              {editPostId === post.id ? (
                <div>
                  <textarea
                    className="w-full text-white bg-gray-700 rounded p-2 mt-2"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="mt-2 bg-green-700 px-3 py-1 rounded text-white"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-base text-white mt-2 whitespace-pre-wrap">
                  {post.content}
                </p>
              )}

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="mt-2 rounded-md max-h-60 w-full object-cover"
                />
              )}

              {/* Facebook-like Reactions */}
              <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
                <div
                  className="relative flex items-center gap-2 cursor-pointer"
                  onMouseEnter={() => {
                    if (hoverTimeout.current)
                      clearTimeout(hoverTimeout.current);
                    setHoveredReaction(post.id);
                  }}
                  onMouseLeave={() => {
                    hoverTimeout.current = setTimeout(
                      () => setHoveredReaction(null),
                      300
                    );
                  }}
                >
                  {reactions[post.id] ? (
                    <span>
                      {
                        REACTIONS.find((r) => r.label === reactions[post.id])
                          ?.emoji
                      }{" "}
                      {reactions[post.id]}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">👍 Like</span>
                  )}

                  {hoveredReaction === post.id && (
                    <div
                      className="absolute bottom-6 left-0 flex gap-2 bg-white p-2 rounded shadow z-20"
                      onMouseEnter={() => {
                        if (hoverTimeout.current)
                          clearTimeout(hoverTimeout.current);
                      }}
                      onMouseLeave={() => {
                        hoverTimeout.current = setTimeout(
                          () => setHoveredReaction(null),
                          300
                        );
                      }}
                    >
                      {REACTIONS.map((reaction) => (
                        <span
                          key={reaction.label}
                          className="text-xl cursor-pointer hover:scale-110 transition-transform"
                          onClick={() =>
                            handleReaction(post.id, reaction.label)
                          }
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    setCommentBoxOpen((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="hover:underline flex items-center gap-1"
                >
                  💬 Comment ({comments[post.id]?.length || 0})
                </button>
              </div>

              {commentBoxOpen[post.id] && (
                <div className="mt-2">
                  <input
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="mt-1 bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleComment(post.id)}
                  >
                    Post
                  </button>
                  <div className="mt-2 space-y-1">
                    {(comments[post.id] || []).map((cmt, idx) => (
                      <div
                        key={idx}
                        className="text-white bg-gray-700 px-3 py-1 rounded"
                      >
                        {cmt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
