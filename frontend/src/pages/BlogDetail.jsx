import React from "react";
import { useParams } from "react-router-dom";
import { blogs } from "../lib/blogs-data";

function BlogDetail() {
  const { slug } = useParams();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <div className="p-10 text-center">Blog not found</div>;
  }

  return (<>          
  <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

    <div className="bg-[#f3ede3] min-h-screen text-[#3a2d28] px-4 md:px-20 py-12">

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-[Playfair_Display] mb-6 mt-20">
        {blog.title}
      </h1>

      {/* Meta */}
      <p className="text-sm text-[#8a7a6a] mb-8">
        {blog.date} — {blog.author}
      </p>

      {/* Image */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full max-h-[500px] object-cover mb-10"
      />

      {/* Content */}
      <div className="prose max-w-none text-[#4b3a32] font-[Inter] leading-relaxed">
        {blog.content}
      </div>

    </div></>

  );
}

export default BlogDetail;