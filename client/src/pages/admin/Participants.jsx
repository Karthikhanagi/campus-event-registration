import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet 
} from 'lucide-react';

const Participants = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, [id, token]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setParticipants(data.participants || []);
      } else {
        showToast('Failed to load event participants', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Network error while loading participants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!participants || participants.length === 0) {
      showToast('No participants to export', 'info');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Student Email', 'Registration Time', 'Ticket ID'];
    const rows = participants.map(p => [
      `"${p.registrationId}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${new Date(p.registeredAt).toLocaleString()}"`,
      `"${p.ticketId}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (event?.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `${safeTitle}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${participants.length} attendee records to CSV!`, 'success');
  };

  const filteredParticipants = participants.filter(p => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(q) || 
           p.email.toLowerCase().includes(q) || 
           p.ticketId.toLowerCase().includes(q);
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
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

      {/* Event Overview Card */}
      {event && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-solid">{event.category}</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                  {participants.length} Confirmed
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{event.title}</h1>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn btn-primary btn-sm"
              disabled={participants.length === 0}
            >
              <FileSpreadsheet size={16} />
              <span>Export Roster (CSV)</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.75rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} />
              <span>{event.date} • {event.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} />
              <span>{event.venue}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} />
              <span>{participants.length} of {event.capacity} Capacity Filled ({Math.round((participants.length / event.capacity) * 100)}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Participants Table Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Attendee Registry</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {filteredParticipants.length} of {participants.length} confirmed student passes.
            </p>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search by student name, email, or ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p>Loading attendee list...</p>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {participants.length === 0 ? 'No Attendees Registered Yet' : 'No Students Match Your Filter'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              {participants.length === 0 
                ? 'When students register for this event, their verified admission records and QR ticket IDs will be listed here.'
                : 'Try clearing your search query to see all participants.'}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>College Email</th>
                  <th>Registration Timestamp</th>
                  <th>Verified Pass / Ticket ID</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <tr key={p.registrationId}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.name}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {p.email}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(p.registeredAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        letterSpacing: '0.04em'
                      }}>
                        {p.ticketId}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Participants;
