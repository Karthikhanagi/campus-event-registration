import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Ticket, 
  ShieldCheck, 
  LogOut, 
  User, 
  Sparkles 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, isStudent, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <Calendar size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.2rem', 
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)'
            }}>
              CAMPUS<span className="gradient-text">.EVENTS</span>
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              color: 'var(--text-muted)',
              marginTop: '-3px',
              fontWeight: 600
            }}>
              Collegiate Event Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link 
            to="/events" 
            style={{ 
              fontSize: '0.9rem', 
              fontWeight: isActive('/events') ? 700 : 500,
              color: isActive('/events') ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: isActive('/events') ? '2px solid var(--primary)' : '2px solid transparent',
              padding: '0.5rem 0'
            }}
          >
            All Events
          </Link>

          {isAuthenticated && (
            <Link 
              to="/my-registrations" 
              style={{ 
                fontSize: '0.9rem', 
                fontWeight: isActive('/my-registrations') ? 700 : 500,
                color: isActive('/my-registrations') ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive('/my-registrations') ? '2px solid var(--primary)' : '2px solid transparent',
                padding: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Ticket size={16} />
              My Registrations
            </Link>
          )}

          {isAdmin && (
            <Link 
              to="/admin" 
              style={{ 
                fontSize: '0.9rem', 
                fontWeight: location.pathname.startsWith('/admin') ? 700 : 500,
                color: location.pathname.startsWith('/admin') ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: location.pathname.startsWith('/admin') ? '2px solid var(--primary)' : '2px solid transparent',
                padding: '0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ShieldCheck size={16} />
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Right actions (Theme Toggle, Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '0.5rem', borderRadius: '50%', width: '2.4rem', height: '2.4rem' }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
          </button>

          {/* Desktop Auth Section */}
          <div style={{ display: 'none' }} className="desktop-auth">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}>
                  <User size={15} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                  <span className={user.role === 'admin' ? 'badge badge-solid' : 'badge badge-tech'} style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline btn-sm"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline mobile-menu-btn"
            style={{ padding: '0.5rem', width: '2.4rem', height: '2.4rem' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Link 
            to="/events" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            All Events
          </Link>

          {isAuthenticated && (
            <Link 
              to="/my-registrations" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Ticket size={16} style={{ color: 'var(--primary)' }} />
              My Registrations
            </Link>
          )}

          {isAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
              Admin Dashboard
            </Link>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                  <span className={user.role === 'admin' ? 'badge badge-solid' : 'badge badge-tech'}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm" 
                  style={{ flex: 1 }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm" 
                  style={{ flex: 1 }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
