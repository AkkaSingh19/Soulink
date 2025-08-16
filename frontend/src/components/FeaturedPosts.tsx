import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApiPost {
  id: number;
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
}

interface BlogPost {
  id: number | string;
  title: string;
  published_date?: string;
  author_name?: string;
  image?: string | null;
  tags: string[];
  read_time: number;
  excerpt: string; 
  slug?: string;
  url?: string;
}

const makeExcerpt = (p: ApiPost, max = 220) => {
  const raw = p.excerpt ?? p.summary ?? p.content ?? p.body ?? "";
  const text = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
};

const normalizeTags = (raw: any[] | undefined): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => {
      if (!t && t !== 0) return null;
      if (typeof t === "string") return t;
      if (typeof t === "object") return (t.name ?? t.title ?? t.tag ?? JSON.stringify(t)).toString();
      return String(t);
    })
    .filter(Boolean) as string[];
};

export function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/blog/api/posts/");
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

        const mapped: BlogPost[] = arr.slice(0, 6).map((p) => {
          const tags = normalizeTags(p.tags);
          const excerpt = makeExcerpt(p, 260) || (p.title ?? "").slice(0, 240);

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

        setPosts(mapped);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    })();
  }, []);

  const formatPublish = (s: string | undefined) => {
    if (!s) return "—";
    const [datePart, timePart = "00:00:00"] = String(s).split(" ");
    const [y, m, d] = (datePart || "").split("-").map(Number);
    const [hh, mm, ss] = (timePart || "").split(":").map(Number);
    const dte = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
    if (isNaN(dte.getTime())) return s;
    return dte.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <section id="featured-stories" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover inspiring stories, insights, and perspectives from our community of writers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md"
              onClick={() => navigate(post.url ?? `/posts/${post.slug ?? post.id}`)}
            >
              <div className="aspect-video overflow-hidden relative">
                {post.image ? (
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800" />
                )}
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 line-clamp-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags && post.tags.length > 0 ? (
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

                  {/* Author & date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{post.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatPublish(post.published_date)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <span>{post.read_time} min read</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
            onClick={() => navigate("/stories")}
          >
            Explore All Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
