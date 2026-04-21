import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          padding: '1.5rem 3rem',
          transition: 'all 0.3s ease',
          backgroundColor: isHovered ? '#5C3A21' : 'rgba(0, 0, 0, 0.3)',
          backdropFilter: isHovered ? 'none' : 'blur(5px)',
          borderBottom: isHovered
            ? '1px solid rgba(255,255,255,0.2)'
            : '1px solid rgba(255,255,255,0.1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#D4A373',
              letterSpacing: '1px',
              textDecoration: 'none'
            }}
          >
            Mudgar Club
          </Link>

          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#D4A373'
                  e.target.style.borderBottomColor = '#D4A373'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white'
                  e.target.style.borderBottomColor = 'transparent'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => (e.target.style.color = '#D4A373')}
            onMouseLeave={(e) => (e.target.style.color = 'white')}
          >
            🛒
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar