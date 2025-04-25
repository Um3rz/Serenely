"use client";

import { useRef, useState, useEffect } from "react";
import { Smile, MessageCircle, ThumbsUp } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useSession } from "next-auth/react";

type Post = {
  id: string;
  content: string;
  imageUrl?: string;
  reactions: string[];
  comments: Comment[];
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

type PostListProps = {
  onPostCreated: () => void;
};

export function PostList({ onPostCreated }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <CreatePostModal onPostCreated={() => {
        fetchPosts();
        onPostCreated();
      }} />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
}

type PostCardProps = {
  post: Post;
  onUpdate: () => void;
};

function PostCard({ post, onUpdate }: PostCardProps) {
  const { data: session } = useSession();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!session?.user) return;

    try {
      await fetch(`/api/posts?id=${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction: emoji }),
      });
      onUpdate();
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleComment = async () => {
    if (!session?.user || !comment.trim()) return;

    try {
      await fetch(`/api/posts?id=${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comment.trim() }),
      });
      setComment("");
      setShowCommentInput(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setShowCommentInput(false); // Reset comment input when toggling comments
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-black">
      <div className="flex items-center gap-2 mb-3">
        {post.user.image && (
          <img
            src={post.user.image}
            alt={post.user.name || "User"}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <h3 className="font-semibold">{post.user.name || "Anonymous"}</h3>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <p className="mb-4">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post attachment"
          className="max-w-full rounded-lg mb-4"
        />
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleReaction("👍")}
          className="flex items-center gap-1 text-gray-600 hover:text-teal-500"
        >
          <ThumbsUp size={16} />
          <span>{post.reactions.filter(r => r === "👍").length}</span>
        </button>
        <button
          onClick={toggleComments}
          className={`flex items-center gap-1 ${
            showComments ? "text-teal-500" : "text-gray-600 hover:text-teal-500"
          }`}
        >
          <MessageCircle size={16} />
          <span>{post.comments.length}</span>
        </button>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex items-center gap-1 text-gray-600 hover:text-teal-500"
        >
          <Smile size={16} />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="mb-4">
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              handleReaction(emoji.native);
              setShowEmojiPicker(false);
            }}
            theme="light"
          />
        </div>
      )}

      {post.reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-50 rounded">
          {Array.from(new Set(post.reactions)).map((emoji, index) => (
            <span key={index} className="text-lg">
              {emoji} {post.reactions.filter(r => r === emoji).length}
            </span>
          ))}
        </div>
      )}

      {showComments && (
        <div className="border-t pt-4 mt-4">
          {!showCommentInput && (
            <button
              onClick={() => setShowCommentInput(true)}
              className="text-teal-600 hover:text-teal-700 text-sm mb-4"
            >
              Write a comment...
            </button>
          )}

          {showCommentInput && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowCommentInput(false);
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (comment.trim()) {
                      handleComment();
                    }
                  }
                }}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300"
              >
                Comment
              </button>
            </div>
          )}

          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 items-start">
                  {comment.user.image && (
                    <img
                      src={comment.user.image}
                      alt={comment.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1 bg-gray-50 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">
                        {comment.user.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type CreatePostModalProps = {
  onPostCreated: () => void;
};

export default function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!content && !image) return;
    if (!session?.user) return;

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    setContent("");
    setImage(null);
    setShowEmojiPicker(false);
    onPostCreated();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const canPost = content.trim() !== "" || image !== null;

  const addEmoji = (emoji: any) => {
    setContent((prev) => prev + emoji.native);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-transparent rounded-xl text-white shadow-md p-4 text-black mb-6">
      <h2 className="text-md  font-semibold mb-2">{session.user.name || "Anonymous"}</h2>

      <textarea
        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
        placeholder={`What's on your mind, ${session.user.name || "Anonymous"}?`}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-start text-sm mt-3 gap-4">
        <button
          type="button"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <span role="img" aria-label="photo">
            📷
          </span>
          <span>Add Photo</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile size={16} />
          <span>Emoji</span>
        </button>
      </div>

      {showEmojiPicker && (
        <div className="mt-2 z-50">
          <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {image && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Selected image: {image.name}</p>
          <button
            type="button"
            className="text-red-500 text-sm"
            onClick={() => setImage(null)}
          >
            Remove
          </button>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            canPost
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </div>
  );
}
