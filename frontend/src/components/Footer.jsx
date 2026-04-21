import { useState } from "react";

const FacebookIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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

const PinterestIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.12-2.4 3.12-5.24 0-2.16-1.46-3.68-3.54-3.68-2.41 0-3.83 1.81-3.83 3.68 0 .73.28 1.51.63 1.94.06.08.07.15.05.23-.06.27-.21.85-.24.97-.04.16-.13.19-.3.12-1.12-.52-1.82-2.17-1.82-3.49 0-2.84 2.06-5.44 5.94-5.44 3.12 0 5.55 2.22 5.55 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.09c-.2.78-.75 1.76-1.12 2.36.84.26 1.73.4 2.65.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

export default function MudgarFooter() {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about-us" },
    { name: "Courses", href: "/courses" },
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
          <svg width="58" height="58" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b5722a" />
                <stop offset="50%" stopColor="#d4904e" />
                <stop offset="100%" stopColor="#7a4018" />
              </linearGradient>
            </defs>
            <line x1="10" y1="48" x2="28" y2="10" stroke="url(#lg1)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="10" cy="48" rx="8" ry="5.5" fill="url(#lg1)" />
            <line x1="46" y1="48" x2="28" y2="10" stroke="url(#lg1)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="46" cy="48" rx="8" ry="5.5" fill="url(#lg1)" />
            <circle cx="28" cy="9" r="5.5" fill="url(#lg1)" />
          </svg>
          <span style={{ marginTop: "5px", fontSize: "13px", letterSpacing: "0.05em", color: "#2e1503", fontStyle: "italic" }}>Mudgarvale</span>
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
            <a href="#" style={{ color: "#2e1503" }}><FacebookIcon /></a>
            <a href="#" style={{ color: "#2e1503" }}><YoutubeIcon /></a>
            <a href="https://www.instagram.com/mudgarvale" target="_blank" rel="noopener noreferrer" style={{ color: "#2e1503" }}>
              <InstagramIcon />
            </a>
            <a href="#" style={{ color: "#2e1503" }}><PinterestIcon /></a>
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
+91 87993 57438,
          </p>
          <a href="mailto:support@mudgarvale.com" style={{ display: "block", fontSize: "14px", color: "#4a2800", textDecoration: "underline", marginBottom: "20px" }}>support@mudgarvale.com</a>
          
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