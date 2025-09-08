"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";

type RawPost = any;

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  // Robust date formatter that accepts numbers, ISO strings, "YYYY-MM-DD", etc.
  const formatDate = (input: any) => {
    if (input === undefined || input === null || String(input).trim() === "") return "—";

    // If already a Date instance
    if (typeof input === "object" && input instanceof Date && !isNaN(input.getTime())) {
      return input.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }

    const rawStr = String(input).trim();

    // Try parsing numbers (epoch seconds or ms)
    const asNum = Number(rawStr);
    if (!Number.isNaN(asNum)) {
      let asMs = asNum;
      const absLen = String(Math.trunc(Math.abs(asNum))).length;
      if (absLen === 10) asMs = asNum * 1000; // seconds -> ms
      const d = new Date(asMs);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      }
    }

    // Try Date constructor (ISO, RFC, etc.)
    const parsed = new Date(rawStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }

    // Extract YYYY-MM-DD inside string
    const m = rawStr.match(/(\d{4}-\d{2}-\d{2})/);
    if (m && m[1]) {
      const d2 = new Date(m[1]);
      if (!isNaN(d2.getTime())) {
        return d2.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      }
    }

    // fallback to original string
    return rawStr;
  };

  // Normalize tags into array of strings
  const normalizeTags = (raw: any): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((t) => {
          if (t === null || t === undefined) return null;
          if (typeof t === "string") return t;
          if (typeof t === "object") {
            return (t.name ?? t.title ?? t.tag ?? t.label ?? null) || JSON.stringify(t);
          }
          return String(t);
        })
        .filter(Boolean) as string[];
    }
    // If single string-ish value
    if (typeof raw === "string") return raw ? [raw] : [];
    return [];
  };

  // Normalize author into name & url
  const normalizeAuthor = (raw: any) => {
    if (!raw && raw !== 0) return { authorName: null, authorUrl: null };
    if (typeof raw === "string") return { authorName: raw, authorUrl: null };
    if (typeof raw === "object") {
      const name = raw.name ?? raw.full_name ?? raw.username ?? raw.title ?? raw.label ?? null;
      const url = raw.url ?? raw.link ?? raw.profile ?? null;
      return { authorName: name ? String(name) : null, authorUrl: url ? String(url) : null };
    }
    return { authorName: String(raw), authorUrl: null };
  };

  // Fetch post and sanitize response
  useEffect(() => {
    if (!id || !token) return;

    let mounted = true;
    setLoading(true);

    axios
      .get(`http://localhost:8000/blog/posts/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then((res) => {
        if (!mounted) return;
        const raw: RawPost = res.data ?? {};

        // Normalize fields
        const title = raw.title ?? raw.name ?? "";
        const image = raw.image ?? raw.cover_image ?? raw.featured_image ?? null;
        const body = raw.body ?? raw.content ?? raw.summary ?? raw.excerpt ?? "";
        const excerpt = raw.excerpt ?? (typeof body === "string" ? body.slice(0, 300) : "");
        const tags = normalizeTags(raw.tags ?? raw.tag_list ?? raw.categories ?? []);
        const { authorName, authorUrl } = normalizeAuthor(raw.author ?? raw.author_name ?? raw.author_object ?? raw.user ?? null);
        const publishValue = raw.publish ?? raw.published_at ?? raw.published_date ?? raw.created_at ?? raw.created ?? (raw.meta && (raw.meta.published ?? raw.meta.published_at)) ?? null;
        const read_time = raw.read_time ?? raw.readTime ?? raw.estimated_read_time ?? null;

        const sanitized = {
          ...raw,
          title: String(title),
          image,
          body: typeof body === "string" ? body : JSON.stringify(body),
          excerpt: typeof excerpt === "string" ? excerpt : String(excerpt),
          tags,
          authorName,
          authorUrl,
          publishValue,
          read_time,
        };

        setPost(sanitized);
      })
      .catch((err) => {
        console.error("Failed to fetch post", err);
        if (mounted) setPost(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, token]);

  // Handle delete
  const handleDelete = async () => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8000/blog/posts/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { confirm: true },
      });
      alert("Post deleted.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check console.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 hover:text-purple-600 transition-colors">
        {post.title || "Untitled"}
      </h1>

      <p className="text-gray-500 mb-4 text-sm">
        Published on {formatDate(post.publishValue)} by{" "}
        {post.authorName ? (
          post.authorUrl ? (
            <a
              href={post.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {post.authorName}
            </a>
          ) : (
            <span>{post.authorName}</span>
          )
        ) : (
          <span>Unknown</span>
        )}
      </p>

      {/* Tags */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full border"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Image preview */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title ?? "Post image"}
          className="w-full max-h-[400px] object-cover rounded mb-6 border"
        />
      )}

      <div className="text-lg whitespace-pre-wrap mb-6" dangerouslySetInnerHTML={{ __html: post.body }} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          onClick={() => navigate(`/posts/${id}/edit`)}
        >
          Edit Post
        </Button>

        {!confirmDelete ? (
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-800 text-white"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        ) : (
          <>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-800 text-white"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
