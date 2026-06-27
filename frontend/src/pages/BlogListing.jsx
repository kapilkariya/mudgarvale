import React from "react";
import { blogs } from "../lib/blogs-data";
import { useEffect } from "react";

function MudgarvaleBlogsListing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#f3ede3] min-h-screen text-[#3a2d28]">
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      {/* Header */}
      <div className="text-center py-16 border-b border-[#e4dbcf] mt-20">
        <h1 className="text-5xl md:text-6xl font-[Playfair_Display] tracking-wide">
          MudgarVale
        </h1>
      </div>

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-6 md:px-10 py-6 text-sm text-[#6e5c50]">
        <div className="flex items-center gap-2 cursor-pointer hover:text-black transition">
          <span>⚙️</span>
          <span>Sort by</span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="cursor-pointer hover:text-black transition">Share</span>
          <span className="cursor-pointer">X</span>
          <span className="cursor-pointer">f</span>
        </div>
      </div>

      {/* FULL WIDTH GRID */}
      <div className="w-full px-4 md:px-10 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">

          {blogs.map((post) => (
            <a key={post.id} href={`/blogs/${post.slug}`}>

              <div className="group">

                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-[260px] md:h-[300px] object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <h2 className="mt-6 text-[30px] md:text-[32px] leading-tight font-[Libre_Baskerville] group-hover:text-[#8b5e3c] transition">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-4 text-[15px] leading-relaxed text-[#6f5c4f] font-[Inter] max-w-[90%]">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <p className="mt-5 text-[13px] text-[#8a7a6a] font-[Inter]">
                  {post.date} — MudgarVale
                </p>

              </div>

            </a>
          ))}

        </div>
      </div>

    </div>
  );
}

export default MudgarvaleBlogsListing;
