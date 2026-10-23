import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { User, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const newUser = await signup(name, email, password, role);
      showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath !== '/' ? redirectPath : '/events');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{
      paddingTop: '3rem',
      paddingBottom: '5rem',
      maxWidth: '500px'
    }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>
            Create an <span className="gradient-text">Account</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Join the campus event network as a student or administrator.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger-text)',
            border: '1px solid var(--status-danger-border)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            fontWeight: 600
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">College Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <input
                id="email"
                type="email"
                placeholder="jane.doe@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius)',
                border: role === 'student' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: role === 'student' ? 'var(--primary-light)' : 'transparent',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: role === 'student' ? 'var(--primary)' : 'var(--text-primary)' }}>
                  Student
                </span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius)',
                border: role === 'admin' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                backgroundColor: role === 'admin' ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  style={{ accentColor: '#8b5cf6' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: role === 'admin' ? '#8b5cf6' : 'var(--text-primary)' }}>
                  Administrator
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <span>{submitting ? 'Creating Profile...' : 'Complete Sign Up'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          Already registered?{' '}
          <Link to={`/login?redirect=${redirectPath}`} style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
