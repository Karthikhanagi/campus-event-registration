import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Eye 
} from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '',
    venue: '',
    capacity: 100,
    imageUrl: ''
  });

  const [registeredCount, setRegisteredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Technical',
          date: data.date || '',
          time: data.time || '',
          venue: data.venue || '',
          capacity: data.capacity || 100,
          imageUrl: data.imageUrl || ''
        });
        setRegisteredCount(data.registeredCount || 0);
      } else {
        showToast('Event not found', 'error');
        navigate('/admin');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Error loading event data', 'error');
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update event', 'error');
        return;
      }

      showToast('Event updated successfully!', 'success');
      navigate('/admin');
    } catch (err) {
      console.error('Update error:', err);
      showToast('Network error while updating event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '1060px' }}>
        <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '380px' }}></div>
      </div>
    );
  }

  const seatsLeft = Math.max(0, formData.capacity - registeredCount);
  const percentFull = Math.min(100, Math.round((registeredCount / formData.capacity) * 100));

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
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Edit Event</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Update schedule, venue, capacity, or event description with live preview.
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
                <label className="form-label" htmlFor="capacity">Capacity *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={Math.max(1, registeredCount)}
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Current confirmed registrations: {registeredCount}
                </span>
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
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <Link to="/admin" className="btn btn-outline">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                <Save size={16} />
                <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
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
                <span className={seatsLeft === 0 ? "badge badge-full" : "badge badge-active"} style={{ backgroundColor: 'var(--bg-primary)' }}>
                  {seatsLeft === 0 ? "SOLD OUT" : `${seatsLeft} SEATS LEFT`}
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

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Capacity</span>
                  <span style={{ fontWeight: 600 }}>{registeredCount} / {formData.capacity}</span>
                </div>
                <div className="progress-container">
                  <div className={`progress-bar ${seatsLeft === 0 ? 'progress-bar-danger' : percentFull >= 70 ? 'progress-bar-warning' : 'progress-bar-active'}`} style={{ width: `${percentFull}%` }}></div>
                </div>
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

export default EditEvent;
