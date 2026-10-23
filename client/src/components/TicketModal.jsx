import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  Ticket as TicketIcon,
  Sparkles 
} from 'lucide-react';

const TicketModal = ({ isOpen, onClose, registration }) => {
  const ticketRef = useRef(null);

  if (!isOpen || !registration) return null;

  const { ticketId, event, studentName, studentEmail, registeredAt } = registration;

  let catBadgeClass = 'badge-tech';
  let headerGradient = 'var(--primary-gradient)';
  if (event?.category === 'Cultural') {
    catBadgeClass = 'badge-cultural';
    headerGradient = 'var(--purple-gradient)';
  } else if (event?.category === 'Sports') {
    catBadgeClass = 'badge-sports';
    headerGradient = 'var(--warning-gradient)';
  } else if (event?.category === 'Academic') {
    catBadgeClass = 'badge-academic';
    headerGradient = 'var(--accent-gradient)';
  }

  const handleDownloadPNG = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Pass-${ticketId || 'admission'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading ticket:', err);
      alert('Unable to generate ticket image. You can use the Print button instead.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '600px', padding: '1.75rem' }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TicketIcon size={16} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Digital Event Pass</h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem', borderRadius: '50%', width: '2.25rem', height: '2.25rem' }}
            aria-label="Close ticket view"
          >
            <X size={16} />
          </button>
        </div>

        {/* Printable / Downloadable VIP Ticket Area */}
        <div ref={ticketRef} className="ticket-container" style={{ backgroundColor: 'var(--bg-card)', padding: '0', overflow: 'hidden' }}>
          {/* Vibrant Pass Header Banner */}
          <div style={{
            background: headerGradient,
            color: '#ffffff',
            padding: '1.5rem 1.75rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  {event?.category || 'CAMPUS EVENT'}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.25, color: '#ffffff' }}>
                  {event?.title || 'College Event'}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.8)' }}>
                  PASS NUMBER
                </span>
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 800, 
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  color: '#ffffff'
                }}>
                  {ticketId}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem 1.75rem' }}>
            {/* Event Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              fontSize: '0.85rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <Calendar size={13} />
                  <span>DATE</span>
                </div>
                <div style={{ fontWeight: 700 }}>{event?.date || 'TBA'}</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ec4899', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <Clock size={13} />
                  <span>TIME</span>
                </div>
                <div style={{ fontWeight: 700 }}>{event?.time || 'TBA'}</div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <MapPin size={13} />
                  <span>VENUE</span>
                </div>
                <div style={{ fontWeight: 700 }}>{event?.venue || 'Campus Auditorium'}</div>
              </div>
            </div>

            {/* Perforation Line */}
            <div className="ticket-perforation"></div>

            {/* Attendee Details & QR Code */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              paddingTop: '0.5rem'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                  OFFICIAL ATTENDEE
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                  {studentName || 'Student Attendee'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {studentEmail || 'student@college.edu'}
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--status-active-bg)',
                  color: 'var(--status-active-text)',
                  border: '1px solid var(--status-active-border)'
                }}>
                  <ShieldCheck size={13} />
                  <span>VERIFIED CAMPUS ADMISSION</span>
                </div>
              </div>

              {/* QR Code */}
              <div style={{
                padding: '0.65rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <QRCodeSVG
                  value={JSON.stringify({
                    ticketId,
                    eventId: event?._id,
                    studentEmail,
                    verified: true
                  })}
                  size={110}
                  level="M"
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                />
                <span style={{ 
                  fontSize: '0.6rem', 
                  fontFamily: 'var(--font-mono)', 
                  color: 'var(--primary)', 
                  marginTop: '4px',
                  fontWeight: 800
                }}>
                  SCAN AT GATE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '1.5rem',
          justifyContent: 'flex-end'
        }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={15} />
            Print Pass
          </button>
          <button onClick={handleDownloadPNG} className="btn btn-primary btn-sm">
            <Download size={15} />
            Download Pass (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
