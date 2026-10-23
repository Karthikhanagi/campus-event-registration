import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import TicketModal from '../components/TicketModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Edit, 
  ListOrdered,
  XCircle,
  Sparkles 
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Registration state
  const [userRegistration, setUserRegistration] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id, token]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/events/${id}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
        if (data.userRegistration) {
          setUserRegistration(data.userRegistration);
        }
      } else {
        showToast('Event not found or has been removed', 'error');
        navigate('/events');
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      showToast('Network error while loading event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to complete registration', 'error');
        return;
      }

      showToast('Registration confirmed! Digital pass generated.', 'success');
      setUserRegistration(data.registration);
      setIsTicketModalOpen(true);
      fetchEventDetails();
    } catch (err) {
      console.error('Registration error:', err);
      showToast('Failed to connect to registration server', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!userRegistration || !window.confirm('Are you sure you want to cancel your registration? Your reserved seat will be released immediately.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`/api/registrations/${userRegistration._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to cancel registration', 'error');
        return;
      }

      showToast('Registration cancelled. Seat released.', 'info');
      setUserRegistration(null);
      fetchEventDetails();
    } catch (err) {
      console.error('Cancellation error:', err);
      showToast('Failed to cancel registration', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '880px' }}>
        <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '340px', marginBottom: '1.5rem', borderRadius: 'var(--radius)' }}></div>
        <div className="skeleton" style={{ width: '70%', height: '36px', marginBottom: '1rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '100px' }}></div>
      </div>
    );
  }

  if (!event) return null;

  const percentFull = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  let catBadgeClass = 'badge-tech';
  if (event.category === 'Cultural') catBadgeClass = 'badge-cultural';
  else if (event.category === 'Sports') catBadgeClass = 'badge-sports';
  else if (event.category === 'Academic') catBadgeClass = 'badge-academic';

  let progressClass = 'progress-bar-active';
  if (event.isFull) progressClass = 'progress-bar-danger';
  else if (percentFull >= 70) progressClass = 'progress-bar-warning';

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem', maxWidth: '980px' }}>
      {/* Back button */}
      <Link 
        to="/events" 
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
        <span>Back to Events</span>
      </Link>

      {/* Main Full Color Banner */}
      <div style={{
        width: '100%',
        height: '380px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        position: 'relative',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} 
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <Calendar size={64} />
          </div>
        )}

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', display: 'flex', gap: '0.5rem' }}>
          <span className={`badge ${catBadgeClass}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            {event.category}
          </span>
        </div>

        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
          {event.isPast ? (
            <span className="badge badge-muted" style={{ backgroundColor: 'var(--bg-primary)', fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
              EVENT CONCLUDED
            </span>
          ) : event.isFull ? (
            <span className="badge badge-full" style={{ backgroundColor: 'var(--bg-primary)', fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
              FULL CAPACITY
            </span>
          ) : (
            <span className="badge badge-active" style={{ backgroundColor: 'var(--bg-primary)', fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
              {event.seatsLeft} SEATS AVAILABLE
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Registration Action Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Title, Description, Info Details */}
        <div style={{ flex: '1 1 540px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            {event.title}
          </h1>

          {/* Quick Details Ribbon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Calendar size={14} />
                <span>DATE</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.date}</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ec4899', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Clock size={14} />
                <span>TIME</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.time}</div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <MapPin size={14} />
                <span>VENUE</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.venue}</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <ShieldCheck size={14} />
                <span>ORGANIZER</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{event.createdBy || 'Campus Council'}</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Users size={14} />
                <span>CAPACITY</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{event.capacity} Attendees</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              About This Event
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-line'
            }}>
              {event.description}
            </p>
          </div>

          {/* Admin Controls Ribbon (If Admin) */}
          {isAdmin && (
            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
                <ShieldCheck size={16} />
                Administrator Controls
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/admin/events/${event._id}/edit`} className="btn btn-outline btn-sm">
                  <Edit size={14} />
                  Edit Event
                </Link>
                <Link to={`/admin/events/${event._id}/participants`} className="btn btn-outline btn-sm">
                  <ListOrdered size={14} />
                  View Participants ({event.registeredCount})
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Registration Card */}
        <div className="card" style={{
          padding: '2rem',
          position: 'sticky',
          top: '5.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Event Registration
          </h3>

          {/* Colored Live Capacity Meter */}
          <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Confirmed Seats</span>
              <span style={{ fontWeight: 700 }}>{event.registeredCount} / {event.capacity}</span>
            </div>
            <div className="progress-container" style={{ height: '8px' }}>
              <div className={`progress-bar ${progressClass}`} style={{ width: `${percentFull}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>{event.seatsLeft} seats left</span>
              <span>{percentFull}% Full</span>
            </div>
          </div>

          {/* Action Conditionals */}
          {userRegistration ? (
            /* Student Already Registered */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1.15rem',
                border: '1.5px solid var(--status-active-border)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--status-active-bg)',
                color: 'var(--status-active-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={24} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>You Are Registered!</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    Pass ID: {userRegistration.ticketId}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsTicketModalOpen(true)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <QrCode size={18} />
                <span>View Digital Ticket Pass</span>
              </button>

              <button 
                onClick={handleCancelRegistration}
                disabled={cancelling}
                className="btn btn-danger btn-sm"
                style={{ width: '100%' }}
              >
                <XCircle size={15} />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Registration'}</span>
              </button>
            </div>
          ) : event.isPast ? (
            /* Event Past */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <AlertCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Registration Closed</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                This event took place on {event.date} and is now concluded.
              </p>
            </div>
          ) : event.isFull ? (
            /* Event Full */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <AlertCircle size={32} style={{ color: 'var(--status-danger-text)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: 'var(--status-danger-text)', marginBottom: '0.25rem' }}>Event Is Full</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                All {event.capacity} seats have been reserved.
              </p>
            </div>
          ) : !isAuthenticated ? (
            /* Guest / Unauthenticated */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Sign in with your student account to reserve your seat and instantly generate your digital QR pass.
              </p>
              <Link 
                to={`/login?redirect=/events/${id}`} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Sign In to Register
              </Link>
              <Link 
                to={`/signup?redirect=/events/${id}`} 
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Create Account
              </Link>
            </div>
          ) : (
            /* Available to Register */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Claim your seat for <strong>{event.title}</strong>. Admission pass with QR barcode is generated instantly upon confirmation.
              </p>
              <button 
                onClick={handleRegister} 
                disabled={registering}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <QrCode size={18} />
                <span>{registering ? 'Confirming Seat...' : 'Register for Event'}</span>
              </button>
            </div>
          )}

          {/* Quick Notice */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <span>• Free admission for authenticated students.</span>
            <span>• One seat per student ID.</span>
            <span>• Cancellations release the seat immediately.</span>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {userRegistration && (
        <TicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          registration={{
            ticketId: userRegistration.ticketId,
            event: event,
            studentName: user?.name,
            studentEmail: user?.email,
            registeredAt: userRegistration.registeredAt
          }}
        />
      )}
    </div>
  );
};

export default EventDetails;
