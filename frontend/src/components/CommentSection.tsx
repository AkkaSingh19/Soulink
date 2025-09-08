import React, { useState } from "react";
import { format } from "date-fns";

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  created: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (data: { name: string; email: string; body: string }) => void;
}

export default function CommentSection({ comments, onSubmit }: CommentSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", body: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) return;
    onSubmit(form);
    setForm({ name: "", email: "", body: "" });
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow">
      {/* Comments heading */}
      <h2 className="text-xl font-bold text-black mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Your Name"
            className="w-1/2 border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-1/2 border rounded p-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <textarea
          placeholder="Write your comment here..."
          className="w-full border rounded p-2"
          rows={4}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
        >
          Submit Comment
        </button>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-pink-800 font-bold">
                  {c.name.charAt(0).toUpperCase()}
                </div>
              </div>
              {/* Comment content */}
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{c.name}</span>{" "}
                  <span className="text-gray-500">({c.email})</span> •{" "}
                  {format(new Date(c.created), "MMM dd, yyyy")}
                </p>
                <p className="mt-1 text-gray-700">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
