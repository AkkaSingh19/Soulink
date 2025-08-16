import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar } from "lucide-react";
import axios from "axios";

import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/fallback/ImageWithFallback";

type Post = {
  id: number | string;
  title?: string;
  content?: string;
  excerpt?: string;
  body?: string;
  summary?: string;
  cover_image?: string | null;
  image?: string | null;
  slug?: string;
  url?: string;
  tags?: string[] | Array<{ name?: string; title?: string }>;
  author?: string;
  author_name?: string;
  published_at?: string | number | null;
  published_date?: string | number | null;
  publish?: string | number | null;
  created_at?: string | number | null;
  created?: string | number | null;
  meta?: any;
  read_time?: number;
};

const extractTags = (p: Post): string[] => {
  if (!p.tags) return [];
  if (typeof p.tags[0] === "string") return p.tags as string[];
  return (p.tags as Array<{ name?: string; title?: string }>)
    .map((t) => t?.name || t?.title)
    .filter(Boolean) as string[];
};

const extractImage = (p: Post) => p.cover_image || p.image || null;

const excerptFrom = (p: Post, max = 140) => {
  const raw = p.excerpt ?? p.summary ?? p.content ?? p.body ?? "";
  const text = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
};

const formatPublish = (input: unknown) => {
  if (!input) return "—";

  if (typeof input === "object" && input instanceof Date && !isNaN(input.getTime())) {
    return input.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  const rawStr = String(input).trim();
  if (!rawStr) return "—";

  // Try "YYYY-MM-DD hh:mm:ss"
  const [datePart, timePart = "00:00:00"] = rawStr.split(" ");
  const [y, m, d] = (datePart || "").split("-").map(Number);
  if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
    const [hh, mm, ss] = (timePart || "").split(":").map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
    if (!isNaN(dt.getTime())) {
      return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }
  }
  const asNum = Number(rawStr);
  if (!Number.isNaN(asNum)) {
    let asMs = asNum;
    const absLen = String(Math.trunc(Math.abs(asNum))).length;
    if (absLen === 10) asMs = asNum * 1000; 
    const dNum = new Date(asMs);
    if (!isNaN(dNum.getTime())) {
      return dNum.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }
  }

  const parsed = new Date(rawStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Extract first YYYY-MM-DD pattern
  const mMatch = rawStr.match(/(\d{4}-\d{2}-\d{2})/);
  if (mMatch && mMatch[1]) {
    const d2 = new Date(mMatch[1]);
    if (!isNaN(d2.getTime())) {
      return d2.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }
  }

  return rawStr;
};


const getPublishField = (p: Post) =>
  p.published_at ??
  p.published_date ??
  p.publish ??
  p.created_at ??
  p.created ??
  (p.meta && (p.meta.published ?? p.meta.published_at)) ??
  null;

export default function TagPostsPage() {
  const { tags: tagsParam } = useParams<{ tags?: string }>();
  const navigate = useNavigate();
  const tags = useMemo(
    () =>
      tagsParam
        ? tagsParam.split(",").map((t) => decodeURIComponent(t.trim())).filter(Boolean)
        : [],
    [tagsParam]
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await axios.get("http://127.0.0.1:8000/blog/api/posts/tag/", {
          params: { tags: tags.join(",") },
        });

        let data: Post[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
          ? res.data.results
          : [];

        if (tags.length > 0) {
          const wanted = tags.map((t) => t.toLowerCase());
          data = data.filter((p) => {
            const tlist = extractTags(p).map((x) => x.toLowerCase());
            return tlist.some((t) => wanted.includes(t));
          });
        }

        if (active) setPosts(data);
      } catch (e) {
        console.error("Failed to load posts:", e);
        if (active) setErr("Failed to load posts.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [tags]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 transition"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Back</span>
      </button>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-1">
          Posts tagged{" "}
          <span className="text-purple-600">{tags.length ? tags.join(", ") : "…"}</span>
        </h1>
        {tags.length > 1 && (
          <p className="text-slate-500 mt-1">
            Showing results that match any selected tag.
          </p>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border bg-white p-4 shadow animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && err && <p className="text-red-600 text-center">{err}</p>}

      {!loading && !err && posts.length === 0 && (
        <p className="text-slate-500 text-center">No posts found for these tag(s).</p>
      )}

      {/* Posts Grid */}
      {!loading && !err && posts.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => {
            const img = extractImage(post);
            const tagList = extractTags(post);
            const href = post.url ?? (post.slug ? `/posts/${post.slug}` : `/posts/${post.id}`);

            return (
              <li key={post.id}>
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md"
                  onClick={() => navigate(href)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    {img ? (
                      <ImageWithFallback
                        src={img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800" />
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 line-clamp-4">
                        {excerptFrom(post)}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {tagList.length > 0 ? (
                          tagList.slice(0, 6).map((t) => {
                            const label = String(t);
                            return (
                              <button
                                key={label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tags/${encodeURIComponent(label)}`);
                                }}
                                className="bg-purple-100 text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                              >
                                #{label}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-gray-500 text-sm">No tags</span>
                        )}
                      </div>

                      {/* Author & date */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author ?? post.author_name ?? "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatPublish(getPublishField(post))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
