import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Github, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '3rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--text-inverted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <Calendar size={14} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                CAMPUS.EVENTS
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The unified collegiate event management and digital ticketing platform. Built for students, faculty, and organizers.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <Link to="/events" style={{ color: 'var(--text-secondary)' }}>Browse All Events</Link>
              <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Sign In / Sign Up</Link>
              <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Portal</Link>
            </div>
          </div>

          {/* Event Categories */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Event Tracks
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link to="/events?category=Technical" style={{ color: 'var(--text-secondary)' }}>Technical Hackathons</Link>
              <Link to="/events?category=Cultural" style={{ color: 'var(--text-secondary)' }}>Cultural Festivals</Link>
              <Link to="/events?category=Sports" style={{ color: 'var(--text-secondary)' }}>Athletics & Sports</Link>
              <Link to="/events?category=Academic" style={{ color: 'var(--text-secondary)' }}>Academic Symposia</Link>
            </div>
          </div>

          {/* Standards & Specs */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Architecture
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Problem Statement 8</span>
              <span>Full-Stack MERN + Vite React</span>
              <span>Strictly Monochrome Design</span>
              <span>QR Code Verification Engine</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} College Event Registration & Management System. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>Theme: Monochrome Dark/Light</span>
            <span>Zero Color Accents</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
