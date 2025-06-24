"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

import { Trash2, BookText, Megaphone, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

type PostType = "Blog" | "Question" | "Announcement";

interface ForumPost {
  id: string;
  name: string;
  title: string;
  content: string;
  type: PostType;
  createdAt: string; // from DB
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("Blog");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

const handleDelete = async (id: string) => {
  try {
    const res = await fetch("/api/forum", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Delete failed");
    setPosts((prev) => prev.filter((post) => post.id !== id));
    toast.success("Post deleted successfully");
  } catch (err) {
    console.error("Delete failed", err);
    toast.error("Failed to delete post");
  }
};


  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!name || !title || !content) return;

    try {
      setLoading(true);
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, content, type }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);

      setName("");
      setTitle("");
      setContent("");
      setType("Blog");
      toast.success("Post created successfully");
    } catch (err) {
      console.error("Post creation failed", err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: PostType) => {
    switch (type) {
      case "Blog":
        return <BookText className="mr-1 text-indigo-500" size={18} />;
      case "Announcement":
        return <Megaphone className="mr-1 text-yellow-500" size={18} />;
      case "Question":
        return <HelpCircle className="mr-1 text-green-500" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Student Forum</h1>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Create a New Post</h2>
          <div className="grid gap-4">
            <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Write your post..." value={content} onChange={(e) => setContent(e.target.value)} />
            <select
              className="border rounded px-3 py-2 focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value as PostType)}
            >
              <option value="Blog">Blog</option>
              <option value="Question">Question</option>
              <option value="Announcement">Announcement</option>
            </select>
            <Button onClick={createPost} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>

        {/* Discussion Heading */}
        <h2 className="text-2xl font-bold text-indigo-800 mb-4 mt-10 border-b pb-2 flex items-center">
          <BookText className="mr-2 text-indigo-500" size={24} />
          Forum Discussions
        </h2>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-center text-indigo-600">No posts yet. Be the first to share something!</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-6 shadow border-l-4 border-indigo-400 relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {getIcon(post.type)}
                    <Badge variant="outline" className="text-indigo-700 border-indigo-400">
                      {post.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-1">{post.title}</h3>
                <p className="text-indigo-700 mb-2 whitespace-pre-line">{post.content}</p>
                <div className="flex justify-between text-sm text-gray-600 italic">
                  <span>— {post.name}</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}