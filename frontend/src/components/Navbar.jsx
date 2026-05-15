import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Reviews', path: '/review' }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleProfileAction = async (action) => {
    if (action === 'signin') {
      navigate('/login')
    } else if (action === 'signup') {
      navigate('/signup')
    } else if (action === 'logout') {
      await logout()
      navigate('/')
    } else if (action === 'myorders') {
      navigate('/my-orders')
    } else if (action === 'admin') {
      navigate('/admin-dashboard')
    }
    setIsProfileDropdownOpen(false)
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
{/* Logo */}
<div 
  onClick={() => handleNavigation('/')}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  }}
>
  <img 
    src="logo.png" 
    alt="Mudgarvale Logo" 
    style={{ 
      width: '40px', 
      height: '40px', 
      objectFit: 'contain',
      borderRadius: '4px'
    }} 
  />
  <span
    style={{
      fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
      fontWeight: 'bold',
      color: '#D4A373',
      letterSpacing: '1px'
    }}
  >
    Mudgarvale
  </span>
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

          {/* Right Side - Cart & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Cart Icon with Badge */}
            <span
              onClick={() => handleNavigation('/cart')}
              style={{ color: 'white', fontSize: '1.4rem', cursor: 'pointer', position: 'relative' }}
            >
              🛒
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#D4A373',
                    color: '#3B1408',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>

            {/* Profile Icon with Dropdown */}
            <div style={{ position: 'relative' }}>
              <span
                onClick={handleProfileClick}
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                style={{ 
                  color: 'white', 
                  fontSize: '1.4rem', 
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
              >
                👤
              </span>

              {/* Dropdown Menu - Fixed to only show when profile dropdown is open */}
              {isProfileDropdownOpen && (
                <div
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '35px',
                    right: '0',
                    backgroundColor: '#5C3A21',
                    minWidth: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 101
                  }}
                >
                  {/* User Info (if logged in) */}
                  {isAuthenticated() && user && (
                    <div
                      style={{
                        padding: '12px 16px',
                        color: '#D4A373',
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '0.9rem'
                      }}
                    >
                      👋 {user.name || user.email}
                    </div>
                  )}

                  {/* Menu - Login when logged out, Orders/Admin/Logout when logged in */}
                  {!isAuthenticated() ? (
                    /* Login Button */
                    <div
                      onClick={() => handleProfileAction('signin')}
                      style={{
                        padding: '12px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#D4A373'
                        e.target.style.color = '#3B1408'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.color = 'white'
                      }}
                    >
                      🔐 Login
                    </div>
                  ) : (
                    /* Logged In Menu */
                    <>
                      {/* My Orders */}
                      <div
                        onClick={() => handleProfileAction('myorders')}
                        style={{
                          padding: '12px 16px',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#D4A373'
                          e.target.style.color = '#3B1408'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent'
                          e.target.style.color = 'white'
                        }}
                      >
                        📦 My Orders
                      </div>

                      {/* Admin Panel - Only for Admins */}
                      {isAdmin() && (
                        <div
                          onClick={() => handleProfileAction('admin')}
                          style={{
                            padding: '12px 16px',
                            color: '#FFD700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#D4A373'
                            e.target.style.color = '#3B1408'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = '#FFD700'
                          }}
                        >
                          ⚙️ Admin Panel
                        </div>
                      )}

                      {/* Logout */}
                      <div
                        onClick={() => handleProfileAction('logout')}
                        style={{
                          padding: '12px 16px',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#D4A373'
                          e.target.style.color = '#3B1408'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent'
                          e.target.style.color = 'white'
                        }}
                      >
                        🚪 Logout
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: 'white'
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
          zIndex: 99,
          padding: '1rem 0',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 70px)'
        }}
      >
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            style={{
              padding: '1rem 1.5rem',
              color: isActive(item.path) ? '#D4A373' : 'white',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {item.name}
          </div>
        ))}
        
        {/* Mobile menu profile options */}
        {!isAuthenticated() ? (
          <div
            onClick={() => handleProfileAction('signin')}
            style={{ padding: '1rem 1.5rem', color: 'white', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            🔐 Login
          </div>
        ) : (
          <>
            <div
              onClick={() => handleProfileAction('myorders')}
              style={{ padding: '1rem 1.5rem', color: 'white', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              📦 My Orders
            </div>
            {isAdmin() && (
              <div
                onClick={() => handleProfileAction('admin')}
                style={{ padding: '1rem 1.5rem', color: '#FFD700', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                ⚙️ Admin Panel
              </div>
            )}
            <div
              onClick={() => handleProfileAction('logout')}
              style={{ padding: '1rem 1.5rem', color: 'white', cursor: 'pointer' }}
            >
              🚪 Logout
            </div>
          </>
        )}
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