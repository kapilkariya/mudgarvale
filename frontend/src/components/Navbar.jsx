import React, { useState } from 'react'

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false)

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
          {/* Logo - Left */}
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#D4A373',
            letterSpacing: '1px'
          }}>
            Mudgar Club
          </div>

          {/* Navigation Links - Middle */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            {['Home', 'Products', 'Blogs', 'About Us', 'Courses', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  cursor: 'pointer'
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
                {item}
              </a>
            ))}
          </div>

          {/* Cart Icon - Right */}
          <a
            href="#"
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
        </div>
      </div>
      
    </div>
  )
}

export default Navbar