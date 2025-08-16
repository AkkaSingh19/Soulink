import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/fallback/ImageWithFallback";
import { Calendar, User, LayoutGrid, List } from "lucide-react";

type ApiPost = {
  id: number | string;
  title?: string;
  publish?: string;
  published_date?: string;
  author?: string;
  author_name?: string;
  image?: string | null;
  cover_image?: string | null;
  tags?: any[]; 
  read_time?: number;
  content?: string;
  excerpt?: string;
  summary?: string;
  body?: string;
  slug?: string;
  url?: string;
};

type BlogPost = {
  id: number | string;
  title: string;
  published_date?: string;
  author_name: string;
  image?: string | null;
  tags: string[];
  read_time: number;
  excerpt: string;
  slug?: string;
  url?: string;
};

const normalizeTags = (raw: any[] | undefined): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object") return (t.name ?? t.title ?? t.tag ?? String(t)).toString();
      return String(t);
    })
    .filter(Boolean) as string[];
};

const makeExcerpt = (p: ApiPost, max = 160) => {
  const raw = p.excerpt ?? p.summary ?? p.content ?? p.body ?? "";
  const text = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) {
    const title = p.title ?? "";
    return title.length > max ? title.slice(0, max).trim() + "…" : title;
  }
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
};

const formatPublish = (s?: string) => {
  if (!s) return "—";
  const [datePart, timePart = "00:00:00"] = String(s).split(" ");
  const [y, m, d] = (datePart || "").split("-").map(Number);
  const [hh, mm, ss] = (timePart || "").split(":").map(Number);
  const dte = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
  if (isNaN(dte.getTime())) return s;
  return dte.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const safeLower = (s?: string) => (s ? s.toLowerCase() : "");

const POSTS_API = "http://localhost:8000/blog/api/posts/";

const AllStories: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(POSTS_API);
        const data = await res.json();

        const arr: ApiPost[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.posts)
          ? data.posts
          : [];

        const mapped: BlogPost[] = arr.map((p) => {
          const tags = normalizeTags(p.tags);
          const excerpt = makeExcerpt(p, 180);
          return {
            id: p.id,
            title: p.title ?? "Untitled",
            published_date: p.publish ?? p.published_date ?? "",
            author_name: p.author ?? p.author_name ?? "Unknown",
            image: p.image ?? p.cover_image ?? null,
            tags,
            read_time: p.read_time ?? 2,
            excerpt,
            slug: p.slug,
            url: p.url,
          };
        });

        if (mounted) setPosts(mapped);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // filter by search: title, tags, excerpt
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const inTitle = safeLower(post.title).includes(searchQuery);
    const inExcerpt = safeLower(post.excerpt).includes(searchQuery);
    const inTags = post.tags.some((t) => safeLower(t).includes(searchQuery));
    return inTitle || inExcerpt || inTags;
  });

  return (
    <div>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {searchQuery ? `Search results for "${searchQuery}"` : "All Stories"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-purple-400 text-white" : "bg-gray-200"}`}
            title="Grid View"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-purple-400 text-white" : "bg-gray-200"}`}
            title="List View"
            aria-pressed={viewMode === "list"}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Posts container */}
      <div className={`max-w-6xl mx-auto px-4 ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className={`group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md 
              ${viewMode === "list" ? "grid grid-cols-[8rem_1fr] gap-4 p-4 items-start" : ""}`}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className={`${viewMode === "list" ? "w-32 h-32" : "aspect-video w-full"} overflow-hidden rounded-md`}>
              <ImageWithFallback
                src={post.image || "https://via.placeholder.com/600x400"}
                alt={post.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "" : ""}`}
              />
            </div>

            <CardContent className={`${viewMode === "list" ? "p-0 flex flex-col justify-between" : "p-6 flex flex-col justify-between"}`}>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className={`mt-2 text-sm text-slate-600 ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-4"}`}>
                  {post.excerpt || "No description available."}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.length ? (
                    post.tags.map((tag) => {
                      const label = String(tag);
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

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatPublish(post.published_date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-3">
                <span className="text-xs text-gray-500">{post.read_time} 2 min read</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllStories;
