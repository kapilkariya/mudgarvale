import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogs } from "../lib/blogs-data";
import { useEffect, useState } from "react";

function MudgarvaleBlogDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { slug } = useParams();
  const [showFullContent, setShowFullContent] = useState(false);
  
  const currentBlog = blogs.find((b) => b.slug === slug);
  const [similarPosts, setSimilarPosts] = useState([]);

  useEffect(() => {
    if (currentBlog) {
      // Find similar posts based on categories
      const similar = blogs
        .filter((b) => b.id !== currentBlog.id && b.tags?.some((tag) => currentBlog.tags?.includes(tag)))
        .slice(0, 3);
      setSimilarPosts(similar);
    }
  }, [currentBlog]);

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-[#f3ede3] flex items-center justify-center">
        <div className="text-center p-10">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-[#3a2d28] mb-2">Article not found</h2>
          <p className="text-[#8a7a6a] mb-6">The post you're searching for doesn't exist or has been relocated.</p>
          <Link to="/blogs" className="inline-block bg-[#5C3A21] text-white px-6 py-3 rounded-lg hover:bg-[#4a2e1a] transition">
            Return to Blog List
          </Link>
        </div>
      </div>
    );
  }

  // Function to format content with proper HTML
  const renderFormattedContent = (content) => {
    // Split content into sections based on ## headers
    const segments = content.split(/\n##\s/);
    
    return segments.map((segment, idx) => {
      if (idx === 0 && !segment.includes('##')) {
        return <p key={idx} className="text-lg leading-relaxed mb-6">{segment.trim()}</p>;
      }
      
      const lines = segment.split('\n');
      const heading = lines[0].trim();
      const restContent = lines.slice(1).join('\n');
      
      // Check for code blocks, lists, blockquotes, etc.
      let processedContent = restContent;
      
      // Handle code blocks
      processedContent = processedContent.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="bg-[#2d2d2d] text-[#f8f8f2] p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm">${code.trim()}</code></pre>`;
      });
      
      // Handle blockquotes
      processedContent = processedContent.replace(/> (.*?)(?=\n\n|\n$)/gs, (match, text) => {
        return `<blockquote class="border-l-4 border-[#5C3A21] pl-6 italic text-[#5a4a3a] my-6">${text.trim()}</blockquote>`;
      });
      
      // Handle tables
      processedContent = processedContent.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, headers, rows) => {
        const headerCells = headers.split('|').filter(cell => cell.trim());
        const headerHtml = `<tr class="bg-[#5C3A21] text-white">${headerCells.map(cell => `<th class="p-3 text-left">${cell.trim()}</th>`).join('')}</tr>`;
        
        const rowsHtml = rows.trim().split('\n').map(row => {
          const cells = row.split('|').filter(cell => cell.trim());
          return `<tr class="border-b border-[#e0d5c8]">${cells.map(cell => `<td class="p-3">${cell.trim()}</td>`).join('')}</tr>`;
        }).join('');
        
        return `<div className="overflow-x-auto my-6"><table className="min-w-full bg-white rounded-lg overflow-hidden shadow">${headerHtml}${rowsHtml}</table></div>`;
      });
      
      // Handle unordered lists
      processedContent = processedContent.replace(/^- (.*?)(?=\n- |\n\n|\n$)/gms, (match) => {
        const items = match.split('\n- ').map(item => item.replace(/^- /, '').trim());
        return `<ul className="list-disc pl-6 my-4 space-y-2">${items.map(item => `<li className="text-[#4b3a32]">${item}</li>`).join('')}</ul>`;
      });
      
      // Handle numbered lists
      processedContent = processedContent.replace(/^\d+\. (.*?)(?=\n\d+\. |\n\n|\n$)/gms, (match) => {
        const items = match.split('\n').map(item => item.replace(/^\d+\. /, '').trim());
        return `<ol className="list-decimal pl-6 my-4 space-y-2">${items.map(item => `<li className="text-[#4b3a32]">${item}</li>`).join('')}</ol>`;
      });
      
      // Handle bold text
      processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold text-[#3a2d28]">$1</strong>');
      
      // Handle italic text
      processedContent = processedContent.replace(/\*(.*?)\*/g, '<em className="italic">$1</em>');
      
      // Handle paragraphs (but avoid double-wrapping pre, blockquote, tables, lists)
      const paragraphs = processedContent.split(/\n\n+/);
      let finalContent = '';
      paragraphs.forEach(para => {
        if (!para.trim()) return;
        if (!para.includes('<pre') && !para.includes('<blockquote') && !para.includes('<table') && !para.includes('<ul') && !para.includes('<ol')) {
          finalContent += `<p className="text-[#4b3a32] leading-relaxed mb-6">${para.trim()}</p>`;
        } else {
          finalContent += para;
        }
      });
      
      return (
        <div key={idx} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3a2d28] mb-4 mt-8 pb-2 border-b-2 border-[#d4c5b5]">
            {heading}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: finalContent }} />
        </div>
      );
    });
  };

  return (
    <>
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <article className="bg-[#f3ede3] min-h-screen text-[#3a2d28]">
        {/* Image Section - No overlay text */}
        <div className="w-full overflow-hidden">
          <img
            src={currentBlog.image}
            alt={currentBlog.title}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          {/* Tags above title */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentBlog.tags?.map((tag, idx) => (
              <span key={idx} className="bg-[#5C3A21]/10 text-[#5C3A21] px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 font-[Playfair_Display] text-[#3a2d28]">
            {currentBlog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-[#8a7a6a] mb-8 pb-4 border-b border-[#d4c5b5]">
            <span>By {currentBlog.author}</span>
            <span>•</span>
            <span>{currentBlog.date}</span>
            <span>•</span>
            <span>{currentBlog.readTime || '5 min read'}</span>
          </div>

          {/* Table of Contents (Auto-generated from H2s) */}
          <div className="bg-white/50 rounded-lg p-6 mb-10 border border-[#d4c5b5]">
            <h3 className="font-bold text-lg mb-3 text-[#5C3A21]">📖 Table of Contents</h3>
            <ul className="space-y-2 text-sm">
              {currentBlog.content.split(/\n##\s/).slice(1).map((section, idx) => {
                const heading = section.split('\n')[0].trim();
                return (
                  <li key={idx}>
                    <a href={`#section-${idx}`} className="text-[#5C3A21] hover:underline">
                      {heading}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {renderFormattedContent(currentBlog.content).map((element, idx) => (
              <div key={idx} id={`section-${idx}`}>
                {element}
              </div>
            ))}
          </div>

          {/* Tags at bottom */}
          <div className="mt-12 pt-8 border-t border-[#d4c5b5] flex flex-wrap gap-2">
            {currentBlog.tags?.map((tag, idx) => (
              <span key={idx} className="bg-[#e0d5c8] text-[#3a2d28] px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-10 flex justify-center gap-4">
            <button className="bg-[#5C3A21] text-white px-6 py-2 rounded-lg hover:bg-[#4a2e1a] transition">
              Share on X
            </button>
            <button className="bg-[#5C3A21] text-white px-6 py-2 rounded-lg hover:bg-[#4a2e1a] transition">
              Share on LinkedIn
            </button>
          </div>
        </div>
      </article>
      
    </>
  );
}

export default MudgarvaleBlogDetail;
