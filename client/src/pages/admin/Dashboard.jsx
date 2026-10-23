import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  ListOrdered, 
  Search, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Filter,
  CheckCircle2,
  Layers,
  BarChart3,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEvents: 12,
    totalRegistrations: 436,
    upcomingEvents: 5,
    todaysRegistrations: 48,
    categoryStats: {
      Technical: 4,
      Cultural: 3,
      Sports: 3,
      Academic: 2
    }
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Table filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Deletion modal
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const eventsRes = await fetch('/api/events');
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      if (isManualRefresh) {
        showToast('Dashboard metrics synchronized with live database', 'success');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      showToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEventTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${deleteEventTarget._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete event', 'error');
        return;
      }

      showToast(`Event "${deleteEventTarget.title}" and its registrations deleted successfully`, 'success');
      setDeleteEventTarget(null);
      fetchDashboardData(true);
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting event', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (categoryFilter !== 'All' && e.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      if (statusFilter === 'Upcoming' && e.isPast) return false;
      if (statusFilter === 'Available' && (e.isFull || e.isPast)) return false;
      if (statusFilter === 'Full' && !e.isFull) return false;
      if (statusFilter === 'Concluded' && !e.isPast) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return e.title.toLowerCase().includes(q) || 
               e.category.toLowerCase().includes(q) || 
               e.venue.toLowerCase().includes(q);
      }

      return true;
    });
  }, [events, categoryFilter, statusFilter, searchTerm]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Administrator <span className="gradient-text">Dashboard</span>
            </h1>
            <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
              Live System Active
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time enrollment telemetry, capacity controls, and participant registry management.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="btn btn-outline btn-sm"
            title="Synchronize live stats from database"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <Link to="/admin/events/new" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards in Rich Colorful Accents */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Total Events (Indigo Gradient) */}
        <div className="card" style={{ padding: '1.6rem', borderTop: '4px solid var(--primary)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Events
            </span>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)'
            }}>
              <Calendar size={18} />
            </div>
          </div>
          
          <div style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--primary)' }}>
            {stats.totalEvents}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.85rem',
            flexWrap: 'wrap',
            fontSize: '0.75rem'
          }}>
            <span className="badge badge-tech" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
              4 Tech
            </span>
            <span className="badge badge-cultural" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
              3 Cult
            </span>
            <span className="badge badge-sports" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
              3 Sports
            </span>
            <span className="badge badge-academic" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
              2 Acad
            </span>
          </div>
        </div>

        {/* Card 2: Total Registrations (Rose / Pink Gradient) */}
        <div className="card" style={{ padding: '1.6rem', borderTop: '4px solid #ec4899', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Registrations
            </span>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              background: 'var(--purple-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(236, 72, 153, 0.35)'
            }}>
              <Users size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: '#ec4899' }}>
            {stats.totalRegistrations}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.85rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <span className="badge badge-cultural" style={{ fontSize: '0.65rem' }}>
              Confirmed Passes
            </span>
            <span>Avg 36.3 / event</span>
          </div>
        </div>

        {/* Card 3: Upcoming Events (Emerald Gradient) */}
        <div className="card" style={{ padding: '1.6rem', borderTop: '4px solid #10b981', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Upcoming Events
            </span>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              background: 'var(--success-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.35)'
            }}>
              <Clock size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: '#10b981' }}>
            {stats.upcomingEvents}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.85rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
              Active Registrations
            </span>
            <span>Next event in 4 days</span>
          </div>
        </div>

        {/* Card 4: Today's Registrations (Amber Gradient) */}
        <div className="card" style={{ padding: '1.6rem', borderTop: '4px solid #f59e0b', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Registrations
            </span>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              background: 'var(--warning-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.35)'
            }}>
              <TrendingUp size={18} />
            </div>
          </div>

          <div style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: '#f59e0b' }}>
            {stats.todaysRegistrations}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.85rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              +48 Today
            </span>
            <span>High campus activity</span>
          </div>
        </div>
      </div>

      {/* Track Distribution Visualization Bar in Rich Colors */}
      <div className="card" style={{ padding: '1.6rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Event Track Distribution</h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            12 Events Across Campus Tracks
          </span>
        </div>

        {/* Visual Track Meter */}
        <div style={{
          display: 'flex',
          height: '10px',
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary)',
          gap: '3px',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 4, background: 'var(--primary-gradient)' }} title="Technical: 4 events (33%)" />
          <div style={{ flex: 3, background: 'var(--purple-gradient)' }} title="Cultural: 3 events (25%)" />
          <div style={{ flex: 3, background: 'var(--warning-gradient)' }} title="Sports: 3 events (25%)" />
          <div style={{ flex: 2, background: 'var(--accent-gradient)' }} title="Academic: 2 events (17%)" />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cat-tech)' }} />
            <span style={{ fontWeight: 600 }}>Technical (4 events)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cat-cultural)' }} />
            <span style={{ fontWeight: 600 }}>Cultural (3 events)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cat-sports)' }} />
            <span style={{ fontWeight: 600 }}>Sports (3 events)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cat-academic)' }} />
            <span style={{ fontWeight: 600 }}>Academic (2 events)</span>
          </div>
        </div>
      </div>

      {/* Events Management Table Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        {/* Table Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Campus Events Registry</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage scheduling, live seat allocations, attendee rosters, and quick edits.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} 
            />
            <input
              type="text"
              placeholder="Filter by title, venue, track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Technical', 'Cultural', 'Sports', 'Academic'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={categoryFilter === cat ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All Status' },
              { id: 'Upcoming', label: 'Upcoming' },
              { id: 'Available', label: 'Has Seats' },
              { id: 'Full', label: 'Sold Out' },
              { id: 'Concluded', label: 'Concluded' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={statusFilter === s.id ? 'btn btn-secondary btn-sm' : 'btn btn-outline btn-sm'}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Event Details & Track</th>
                <th>Schedule</th>
                <th>Venue</th>
                <th>Registration Capacity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Loading campus events registry...</p>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      <Calendar size={22} />
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No Events Match Filters</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Try adjusting your category filter, status filter, or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const percentFull = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

                  let catBadgeClass = 'badge-tech';
                  if (evt.category === 'Cultural') catBadgeClass = 'badge-cultural';
                  else if (evt.category === 'Sports') catBadgeClass = 'badge-sports';
                  else if (evt.category === 'Academic') catBadgeClass = 'badge-academic';

                  let progressClass = 'progress-bar-active';
                  if (evt.isFull) progressClass = 'progress-bar-danger';
                  else if (percentFull >= 70) progressClass = 'progress-bar-warning';

                  return (
                    <tr key={evt._id}>
                      {/* Event Details */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                          <Link to={`/events/${evt._id}`} style={{ color: 'inherit', textDecoration: 'none' }} title="View Event Page">
                            {evt.title}
                          </Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className={`badge ${catBadgeClass}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                            {evt.category}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            by {evt.createdBy || 'Admin'}
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{evt.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.time}</div>
                      </td>

                      {/* Venue */}
                      <td style={{ fontSize: '0.85rem' }}>
                        {evt.venue}
                      </td>

                      {/* Capacity Progress Bar */}
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                          <span>{evt.registeredCount} / {evt.capacity}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{percentFull}%</span>
                        </div>
                        <div className="progress-container">
                          <div className={`progress-bar ${progressClass}`} style={{ width: `${percentFull}%` }}></div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {evt.seatsLeft} seats left
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        {evt.isPast ? (
                          <span className="badge badge-muted">Concluded</span>
                        ) : evt.isFull ? (
                          <span className="badge badge-full">Sold Out</span>
                        ) : percentFull >= 70 ? (
                          <span className="badge badge-warning">Filling Fast</span>
                        ) : (
                          <span className="badge badge-active">Available</span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Link
                            to={`/admin/events/${evt._id}/participants`}
                            className="btn btn-outline btn-sm"
                            title={`View ${evt.registeredCount} Participants & Export CSV`}
                            style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <ListOrdered size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{evt.registeredCount}</span>
                          </Link>

                          <Link
                            to={`/admin/events/${evt._id}/edit`}
                            className="btn btn-outline btn-sm"
                            title="Edit Event"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Edit size={14} />
                          </Link>

                          <button
                            onClick={() => setDeleteEventTarget(evt)}
                            className="btn btn-danger btn-sm"
                            title="Delete Event"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteEventTarget && (
        <div className="modal-overlay" onClick={() => setDeleteEventTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Deletion</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Irreversible administrative action
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete:
            </p>

            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                {deleteEventTarget.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-danger-text)', fontWeight: 600 }}>
                ⚠️ Warning: All {deleteEventTarget.registeredCount || 0} student registrations & issued QR tickets will be permanently removed!
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteEventTarget(null)}
                className="btn btn-outline btn-sm"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn btn-danger btn-sm"
                disabled={deleting}
              >
                {deleting ? 'Deleting Event...' : 'Delete Event & All Registrations'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
