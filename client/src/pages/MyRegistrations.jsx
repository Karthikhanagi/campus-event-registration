import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import TicketModal from '../components/TicketModal';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Sparkles 
} from 'lucide-react';

const MyRegistrations = () => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, [token]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      } else {
        showToast('Failed to load your event registrations', 'error');
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      showToast('Connection error while fetching passes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? Your reserved seat will be released immediately.`)) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to cancel pass', 'error');
        return;
      }

      showToast('Registration cancelled. Reserved seat released.', 'info');
      setRegistrations(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Cancellation error:', err);
      showToast('Network error while cancelling pass', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              My Registrations
            </h1>
            <span className="badge badge-tech" style={{ fontSize: '0.8rem' }}>
              {registrations.length} Passes
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            All your confirmed campus event passes and QR admission tickets.
          </p>
        </div>

        <Link to="/events" className="btn btn-outline btn-sm">
          <span>Find More Events</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card" style={{ padding: '1.75rem', height: '140px' }}>
              <div className="skeleton" style={{ width: '40%', height: '24px', marginBottom: '0.75rem' }}></div>
              <div className="skeleton" style={{ width: '25%', height: '16px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton" style={{ width: '60%', height: '16px' }}></div>
            </div>
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="card" style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Ticket size={28} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Event Registrations Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
            You haven't reserved any event tickets yet. Explore upcoming hackathons, athletic matches, and cultural festivals.
          </p>
          <Link to="/events" className="btn btn-primary">
            Explore Events &rarr;
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {registrations.map((reg) => {
            const evt = reg.event;

            let catBadgeClass = 'badge-tech';
            let stripeColor = 'var(--primary)';
            if (evt?.category === 'Cultural') {
              catBadgeClass = 'badge-cultural';
              stripeColor = 'var(--cat-cultural)';
            } else if (evt?.category === 'Sports') {
              catBadgeClass = 'badge-sports';
              stripeColor = 'var(--cat-sports)';
            } else if (evt?.category === 'Academic') {
              catBadgeClass = 'badge-academic';
              stripeColor = 'var(--cat-academic)';
            }

            return (
              <div 
                key={reg._id} 
                className="card" 
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  borderLeft: `5px solid ${stripeColor}`
                }}
              >
                {/* Event & Pass Information */}
                <div style={{ flex: '1 1 360px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge ${catBadgeClass}`}>{evt?.category || 'EVENT'}</span>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.8rem', 
                      color: 'var(--text-muted)',
                      letterSpacing: '0.04em',
                      fontWeight: 600
                    }}>
                      {reg.ticketId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {evt?.title || 'Event Record'}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} style={{ color: 'var(--primary)' }} />
                      <span>{evt?.date || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} style={{ color: '#ec4899' }} />
                      <span>{evt?.time || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} style={{ color: '#0ea5e9' }} />
                      <span>{evt?.venue || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setSelectedTicket(reg)}
                    className="btn btn-primary btn-sm"
                  >
                    <QrCode size={16} />
                    <span>View Digital Pass</span>
                  </button>

                  <button
                    onClick={() => handleCancelRegistration(reg._id, evt?.title)}
                    disabled={cancellingId === reg._id}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={14} />
                    <span>{cancellingId === reg._id ? 'Cancelling...' : 'Cancel Pass'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          registration={{
            ticketId: selectedTicket.ticketId,
            event: selectedTicket.event,
            studentName: user?.name,
            studentEmail: user?.email,
            registeredAt: selectedTicket.registeredAt
          }}
        />
      )}
    </div>
  );
};

export default MyRegistrations;
