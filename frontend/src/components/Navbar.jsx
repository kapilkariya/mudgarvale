import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          padding: '1rem 1.5rem',
          transition: 'all 0.3s ease',
          backgroundColor: isHovered ? '#5C3A21' : 'rgba(0, 0, 0, 0.3)',
          backdropFilter: isHovered ? 'none' : 'blur(5px)',
          borderBottom: isHovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>

          {/* ✅ FIXED LOGO */}
          <div 
            onClick={() => handleNavigation('/')}
            style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
              fontWeight: 'bold',
              color: '#D4A373',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
          >
            Mudgarvale
          </div>

          {/* Desktop Navigation */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              alignItems: 'center'
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                style={{
                  color: isActive(item.path) ? '#D4A373' : 'white',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 0',
                  borderBottom: isActive(item.path)
                    ? '2px solid #D4A373'
                    : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              onClick={() => handleNavigation('/cart')}
              style={{ color: 'white', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              🛒
            </span>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: '70px',
          width: '100%',
          backgroundColor: '#5C3A21',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-150%)',
          transition: '0.3s',
          zIndex: 99
        }}
      >
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            style={{
              padding: '1rem',
              color: isActive(item.path) ? '#D4A373' : 'white',
              cursor: 'pointer'
            }}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  )
}

export default Navbar