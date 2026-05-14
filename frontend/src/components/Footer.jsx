import { useState } from "react";


const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.8 12 21.8 12 21.8s4.2 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.3l8.1 3.6-8.1 3.6z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);


export default function MudgarFooter() {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer style={{ backgroundColor: "#f2e0c0", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#2e1503" }}>
      
      {/* Top Header Section */}
      <div style={{ 
        maxWidth: "1280px", 
        margin: "0 auto", 
        padding: "36px 20px 0", 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "space-between", 
        alignItems: "center",
        gap: "20px"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <img 
            src="logo.png" 
            alt="Mudgarvale Logo" 
            style={{ width: "58px", height: "58px", objectFit: "contain" }}
          />
          <span style={{ marginTop: "5px", fontSize: "13px", letterSpacing: "0.05em", color: "#2e1503", fontStyle: "italic" }}>mudgarvale</span>
        </div>

        {/* Amazon Badge */}
        <div style={{ minWidth: "150px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2e1503", fontFamily: "Arial, sans-serif", margin: "0 0 5px 0" }}>
            WE ARE AVAILABLE ON
          </p>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontFamily: "'Arial Black', 'Arial Bold', Arial, sans-serif", fontWeight: "900", fontSize: "32px", letterSpacing: "-1.5px", color: "#111111", lineHeight: 1 }}>
              amazon
            </span>
            <svg viewBox="0 0 136 20" width="120" height="18" style={{ display: "block", marginTop: "-3px" }}>
              <path d="M10 8 Q68 26 126 8" stroke="#FF9900" strokeWidth="3.8" fill="none" strokeLinecap="round" />
              <path d="M122 4 L129 10 L122 16" stroke="#FF9900" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: "1280px", margin: "20px auto 0", padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid #c4a06a", margin: 0 }} />
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        maxWidth: "1280px", 
        margin: "0 auto", 
        padding: "40px 20px 56px", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: "40px" 
      }}>
        {/* About Us */}
        <div style={{ maxWidth: "400px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "18px", color: "#2e1503" }}>About Us</h3>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#4a2800", marginBottom: "22px" }}>
            At Mudgarvale Private Limited, we bring you authentic Indian traditional fitness equipment tools
            like Mudgar, Gada, Samtola, Shena Push-Up Board and Indian Clubs.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "#2e1503" }}><YoutubeIcon /></a>
            <a href="https://www.instagram.com/mudgarvale" target="_blank" rel="noopener noreferrer" style={{ color: "#2e1503" }}>
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#2e1503", margin: "0 0 18px 0" }}>Quick links</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} style={{ fontSize: "14px", color: "#4a2800", textDecoration: "none" }}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#2e1503", margin: "0 0 18px 0" }}>Information</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Privacy Policy", "Terms & Conditions", "Shipping Policy", "Warranty", "Returns & Refunds"].map((link) => (
              <li key={link}><a href="#" style={{ fontSize: "14px", color: "#4a2800", textDecoration: "none", lineHeight: "1.4" }}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#2e1503", margin: "0 0 18px 0" }}>Contact Us</h3>
          <p style={{ fontSize: "14px", color: "#4a2800", lineHeight: "1.6", marginBottom: "14px" }}>
            39 krishna nagar ,<br />near shanti nagar udhana,<br /> Surat
+91 7016243133,
          </p>
          <a href="mailto:mudgarvale@gmail.com" style={{ display: "block", fontSize: "14px", color: "#4a2800", textDecoration: "underline", marginBottom: "20px" }}>mudgarvale@gmail.com</a>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "12px", 
                fontSize: "14px", 
                border: "none", 
                borderRadius: "4px", 
                backgroundColor: "#d9c4a0", 
                color: "#2e1503", 
                boxSizing: "border-box" 
              }}
            />
            <button
              onClick={() => email && alert(`Subscribed: ${email}`)}
              style={{ 
                width: "100%", 
                padding: "12px", 
                fontSize: "12px", 
                fontWeight: "700", 
                letterSpacing: "0.1em", 
                backgroundColor: "#2e1503", 
                color: "#f2e0c0", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Illustration Strip */}
      <div style={{ 
        backgroundColor: "#f2e0c0", 
        overflow: "hidden", 
        borderTop: "1px solid #d9c4a0" 
      }}>
        <img
          src="image_0.png" 
          alt="Traditional fitness illustration"
          style={{ 
            width: "100%", 
            minWidth: "800px", 
            height: "auto", 
            display: "block",
            margin: "0 auto"
          }}
        />
      </div>
    </footer>
  );
}