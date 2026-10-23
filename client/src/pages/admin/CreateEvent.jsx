import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { 
  ArrowLeft, 
  Plus, 
  Image as ImageIcon, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye 
} from 'lucide-react';

const CreateEvent = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '10:00 AM',
    venue: '',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  });

  const [submitting, setSubmitting] = useState(false);

  const imagePresets = [
    { label: 'Technical Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cultural Festival', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
    { label: 'Athletics & Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' },
    { label: 'Academic Colloquium', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.venue || !formData.capacity) {
      showToast('Please fill all required event details', 'error');
      return;
    }

    if (formData.capacity <= 0) {
      showToast('Capacity must be a positive integer', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to create event', 'error');
        return;
      }

      showToast('Event published successfully!', 'success');
      navigate('/admin');
    } catch (err) {
      console.error('Create error:', err);
      showToast('Network error while creating event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '1060px' }}>
      <Link 
        to="/admin" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Create New Campus Event</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure event logistics, seat limits, and visual assets with live card preview.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">Event Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Winter AI & Cyber Hackathon 2026"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Category & Capacity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category Track *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="capacity">Total Capacity *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="time">Time *</label>
                <input
                  id="time"
                  name="time"
                  type="text"
                  placeholder="10:00 AM"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div className="form-group">
              <label className="form-label" htmlFor="venue">Venue / Location *</label>
              <input
                id="venue"
                name="venue"
                type="text"
                placeholder="e.g. Auditorium A, Tech Complex"
                value={formData.venue}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">Event Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Overview, rules, prerequisites, and prizes..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                required
              />
            </div>

            {/* Banner Image URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Banner Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
              
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={12} /> Presets:
                </span>
                {imagePresets.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: preset.url }))}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <Link to="/admin" className="btn btn-outline">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                <Plus size={16} />
                <span>{submitting ? 'Publishing...' : 'Publish Event'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <Eye size={16} />
            <span>LIVE STUDENT DISCOVERY PREVIEW</span>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              height: '180px',
              backgroundColor: 'var(--bg-secondary)',
              position: 'relative',
              overflow: 'hidden',
              borderBottom: '1px solid var(--border-color)'
            }}>
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(110%)' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Calendar size={48} />
                </div>
              )}
              <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                <span className="badge badge-solid">{formData.category}</span>
              </div>
              <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem' }}>
                <span className="badge badge-active" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  {formData.capacity || 0} SEATS AVAILABLE
                </span>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {formData.title || 'Untitled Event'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {formData.description || 'Event description will appear here...'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Calendar size={14} />
                  <span>{formData.date || 'YYYY-MM-DD'} • {formData.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <MapPin size={14} />
                  <span>{formData.venue || 'Campus Venue'}</span>
                </div>
              </div>

              <div className="progress-container" style={{ marginBottom: '1rem' }}>
                <div className="progress-bar progress-bar-active" style={{ width: '5%' }}></div>
              </div>

              <button type="button" className="btn btn-outline" style={{ width: '100%' }} disabled>
                View Details & Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
