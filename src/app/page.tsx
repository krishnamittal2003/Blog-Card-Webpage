"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { useState, useEffect } from "react";

// Define the BlogPost interface
interface BlogPost {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  fullContent: string;
}

const initialBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Blog Post 1",
    description: "This is the first blog post.",
    imageUrl: "https://via.placeholder.com/400x200?text=Blog+Post+1",
    fullContent: "This is the complete content for the first blog post",
  },
  {
    id: 2,
    title: "Blog Post 2",
    description: "This is the second blog post.",
    imageUrl: "https://via.placeholder.com/400x200?text=Blog+Post+2",
    fullContent: "This is the complete content for the second blog post",
  },
];

export default function Home() {
  const { setTheme } = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    // Load blogs from local storage or use initialBlogs
    const savedBlogs = localStorage.getItem("blogs");
    return savedBlogs ? JSON.parse(savedBlogs) : initialBlogs;
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newBlog, setNewBlog] = useState<{
    title: string;
    description: string;
    fullContent: string;
    imageFile: File | null;
  }>({
    title: "",
    description: "",
    fullContent: "",
    imageFile: null,
  });
  const [expandedBlogId, setExpandedBlogId] = useState<number | null>(null); // Add state for expanded blog

  useEffect(() => {
    // Save blogs to local storage whenever they change
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      blogs.forEach((blog) => {
        if (blog.imageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(blog.imageUrl);
        }
      });
    };
  }, [blogs]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      imageFile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = blogs.length + 1;
    const newImageUrl = newBlog.imageFile
      ? URL.createObjectURL(newBlog.imageFile)
      : "https://via.placeholder.com/400x200?text=New+Blog+Post";

    const newBlogPost: BlogPost = {
      id: newId,
      title: newBlog.title,
      description: newBlog.description,
      imageUrl: newImageUrl,
      fullContent: newBlog.fullContent,
    };

    setBlogs([...blogs, newBlogPost]);
    setIsFormVisible(false); // Hide the form after submission
    setNewBlog({
      title: "",
      description: "",
      fullContent: "",
      imageFile: null,
    }); // Reset form
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <ThemeProvider attribute="class">
      <div className="container mx-auto p-8">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-8">Blog Showcase</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mb-10" variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="mb-10"
              variant="outline"
              size="icon"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              <Plus className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Add Blog Post</span>
            </Button>
          </div>
        </div>

        {isFormVisible && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 p-4 border rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-lg font-medium text-teal-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newBlog.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-12"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-teal-700">
                Description
              </label>
              <textarea
                name="description"
                value={newBlog.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-32"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-teal-700">
                Full Content
              </label>
              <textarea
                name="fullContent"
                value={newBlog.fullContent}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-64"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-teal-700">
                Image
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <Button
              className="mt-4 text-lg font-medium text-teal-700"
              type="submit"
              variant="secondary"
            >
              Add Blog Post
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isExpanded={blog.id === expandedBlogId}
              onToggleExpand={() =>
                setExpandedBlogId(expandedBlogId === blog.id ? null : blog.id)
              }
              onDelete={handleDelete} // Pass the handleDelete function
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

function BlogCard({
  blog,
  isExpanded,
  onToggleExpand,
  onDelete,
}: {
  blog: BlogPost;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="relative-position p-4 transition-all transform hover:scale-105 hover:shadow-lg hover:border-4 hover:border-teal-50 fade-in">
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
      <p className="text-gray-700">{blog.description}</p>
      {isExpanded && <p className="text-gray-600 mt-2">{blog.fullContent}</p>}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={onToggleExpand} variant="secondary">
          {isExpanded ? "Read Less" : "Read More"}
        </Button>
        <Button
          onClick={() => onDelete(blog.id)}
          variant="outline"
          className="text-red-500"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
