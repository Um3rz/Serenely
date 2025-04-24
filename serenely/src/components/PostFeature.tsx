// File: components/PostFeature.tsx
"use client";

import { useRef, useState } from "react";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

type CreatePostModalProps = {
  username: string;
  onPostCreated: () => void;
};

export default function CreatePostModal({
  username,
  onPostCreated,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!content && !image) return;

    const formData = new FormData();
    formData.append("author", username);
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

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-black mb-6">
      <h2 className="text-md font-semibold mb-2">{username}</h2>

      <textarea
        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={`What's on your mind, ${username}?`}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-start text-sm text-green-700 mt-3 gap-4">
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
        <div className="mt-3 text-sm text-gray-600 italic truncate">
          Selected: {image.name}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canPost}
        className={`mt-4 w-full font-semibold py-2 px-4 rounded-lg transition ${
          canPost
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        Post
      </button>
    </div>
  );
}
