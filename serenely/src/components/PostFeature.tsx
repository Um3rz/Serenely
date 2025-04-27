"use client";

import { useRef, useState, useEffect } from "react";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";

type Post = {
  id: string;
  content: string;
  imageUrl?: string;
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
    setShowCommentInput(false);
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
          onClick={toggleComments}
          className={`flex items-center gap-1 ${
            showComments ? "text-teal-500" : "text-gray-600 hover:text-teal-500"
          }`}
        >
          <MessageCircle size={16} />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && post.comments.length > 0 && (
        <div className="space-y-2 mb-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-2">
                {comment.user.image && (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-semibold">{comment.user.name}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {showCommentInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Post
          </button>
        </div>
      )}

      {!showCommentInput && session?.user && (
        <button
          onClick={() => setShowCommentInput(true)}
          className="text-gray-600 hover:text-teal-500"
        >
          Write a comment...
        </button>
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
    onPostCreated();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const canPost = content.trim() !== "" || image !== null;

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
      </div>

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
