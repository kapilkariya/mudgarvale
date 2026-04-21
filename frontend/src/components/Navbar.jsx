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
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
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
          margin: '0 auto',
          height: '100%'
        }}>
          {/* Logo - Left */}
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
            MudgarFitnessClub
          </div>

          {/* Desktop Navigation Links - Middle */}
          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 3vw, 2.5rem)',
            alignItems: 'center'
          }}
          className="desktop-nav"
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
                  borderBottom: isActive(item.path) ? '2px solid #D4A373' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = '#D4A373'
                    e.target.style.borderBottomColor = '#D4A373'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.color = 'white'
                    e.target.style.borderBottomColor = 'transparent'
                  }
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Cart Icon & Mobile Menu Button - Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <a
              onClick={() => handleNavigation('/cart')}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.4rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                padding: '0.5rem 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#D4A373'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'white'
              }}
            >
              🛒
            </a>

            {/* Hamburger Menu Icon - Three Lines */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '30px',
                height: '30px'
              }}
              className="mobile-menu-btn"
            >
              <span style={{
                width: '25px',
                height: '2px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></span>
              <span style={{
                width: '25px',
                height: '2px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                opacity: isMobileMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                width: '25px',
                height: '2px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none'
              }}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          width: '100%',
          backgroundColor: '#5C3A21',
          backdropFilter: 'blur(10px)',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-150%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 99,
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          boxShadow: isMobileMenuOpen ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '0 1.5rem'
        }}>
          {navItems.map((item) => (
            <a
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              style={{
                color: isActive(item.path) ? '#D4A373' : 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'block',
                transition: 'all 0.2s ease',
                borderLeft: isActive(item.path) ? '3px solid #D4A373' : '3px solid transparent',
                paddingLeft: isActive(item.path) ? '12px' : '0'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.color = '#D4A373'
                  e.target.style.paddingLeft = '12px'
                  e.target.style.borderLeftColor = '#D4A373'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.color = 'white'
                  e.target.style.paddingLeft = '0'
                  e.target.style.borderLeftColor = 'transparent'
                }
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* CSS for responsive design */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }

        /* Prevent body scroll when mobile menu is open */
        ${isMobileMenuOpen ? `
          body {
            overflow: hidden;
          }
        ` : ''}
      `}</style>
    </div>
  )
}

export default Navbar