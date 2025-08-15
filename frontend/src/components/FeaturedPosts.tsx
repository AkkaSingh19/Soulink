import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApiPost {
  id: number;
  title: string;
  publish: string;      
  author: string;       
  image: string;
  tags: string[];
  read_time?: number;
}

interface BlogPost {
  id: number;
  title: string;
  published_date: string; 
  author_name: string;   
  image: string;
  tags: string[];
  read_time: number;
}

export function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/blog/api/posts/")
      .then(res => res.json())
      .then(data => {
        const arr: ApiPost[] = Array.isArray(data) ? data : (data?.results ?? []);
        const mapped: BlogPost[] = arr.slice(0, 6).map(p => ({
          id: p.id,
          title: p.title,
          published_date: p.publish,         
          author_name: p.author || "Unknown",
          image: p.image,
          tags: p.tags ?? [],
          read_time: p.read_time ?? 2,
        }));
        setPosts(mapped);
      })
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  
  const formatPublish = (s: string | undefined) => {
    if (!s) return "—";
    const [datePart, timePart = "00:00:00"] = s.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);
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
          {posts.map(post => (
            <Card
              key={post.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className="aspect-video overflow-hidden relative">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.length > 0 ? (
                      post.tags.map((tag: any) => (
                        <button
                          key={tag.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tags/${encodeURIComponent(tag.name)}`);
                          }}
                          className="bg-purple-100 text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                        >
                          #{tag.name}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No tags</span>
                    )}
                  </div>

                  {/* Author & date */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
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
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{post.read_time} min read</span>
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
