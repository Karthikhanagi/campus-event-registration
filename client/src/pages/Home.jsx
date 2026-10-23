import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  QrCode, 
  Sparkles, 
  Cpu, 
  Music, 
  Trophy, 
  GraduationCap, 
  CheckCircle, 
  Clock,
  Compass 
} from 'lucide-react';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch('/api/events?upcoming=true');
        if (res.ok) {
          const data = await res.json();
          setFeaturedEvents(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const categories = [
    { 
      name: 'Technical', 
      icon: <Cpu size={24} />, 
      desc: 'Hackathons, robotics contests, CTF & developer labs',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)'
    },
    { 
      name: 'Cultural', 
      icon: <Music size={24} />, 
      desc: 'Battle of bands, street theatre, fashion fests & music',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.12)',
      border: 'rgba(236, 72, 153, 0.3)'
    },
    { 
      name: 'Sports', 
      icon: <Trophy size={24} />, 
      desc: 'Varsity athletics, football tournaments & chess meets',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)'
    },
    { 
      name: 'Academic', 
      icon: <GraduationCap size={24} />, 
      desc: 'Scientific colloquia, AI symposia & research summits',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.12)',
      border: 'rgba(14, 165, 233, 0.3)'
    }
  ];

  return (
    <div>
      {/* Hero Section with Vibrant Gradient Glow */}
      <section style={{
        padding: '5.5rem 0 4.5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.18), transparent)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Sparkles size={14} />
            <span>Collegiate Event Registration & Management System</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            lineHeight: 1.15
          }}>
            Discover, Register & <br />
            <span className="gradient-text">Experience Campus Events.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            From 36-hour hackathons and collegiate cultural festivals to athletic meets and academic research symposiums. Claim your instant digital pass with verifiable QR entry codes.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/events" className="btn btn-primary btn-lg">
              <span>Browse All Events</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/admin" className="btn btn-outline btn-lg">
              <span>Admin Dashboard</span>
            </Link>
          </div>

          {/* Key Metric Counters */}
          <div style={{
            marginTop: '3.75rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            textAlign: 'center'
          }} className="hero-metrics">
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>12</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Events</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ec4899' }}>436</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registrations</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>5</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Upcoming</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>QR Ticketed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid with Distinct Colorful Themes */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-tech" style={{ marginBottom: '0.5rem' }}>Campus Tracks</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Events by Category</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Filter activities tailored to your passion, competitive field, and academic major.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/events?category=${cat.name}`}
                className="card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderTop: `4px solid ${cat.color}`
                }}
              >
                <div style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: cat.bg,
                  border: `1px solid ${cat.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: cat.color
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.5 }}>
                  {cat.desc}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginTop: '1.25rem',
                  color: cat.color
                }}>
                  <span>Browse Track</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events in Rich Colors */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '0.5rem' }}>Next on Campus</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Featured Upcoming Events</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Seats fill quickly. Reserve your verified pass before registration closes.
              </p>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm">
              View All 12 Events &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid-cols-auto-fit">
              {[1, 2, 3].map(n => (
                <div key={n} className="card" style={{ height: '380px', padding: '1.5rem' }}>
                  <div className="skeleton" style={{ width: '100%', height: '180px', marginBottom: '1rem' }}></div>
                  <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton" style={{ width: '90%', height: '16px' }}></div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p>No upcoming events at this moment.</p>
            </div>
          ) : (
            <div className="grid-cols-auto-fit">
              {featuredEvents.map((evt) => {
                const percentFull = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

                let catBadgeClass = 'badge-tech';
                if (evt.category === 'Cultural') catBadgeClass = 'badge-cultural';
                else if (evt.category === 'Sports') catBadgeClass = 'badge-sports';
                else if (evt.category === 'Academic') catBadgeClass = 'badge-academic';

                let progressClass = 'progress-bar-active';
                if (evt.isFull) progressClass = 'progress-bar-danger';
                else if (percentFull >= 70) progressClass = 'progress-bar-warning';

                return (
                  <div key={evt._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Full Color Banner */}
                    <div style={{
                      height: '190px',
                      backgroundColor: 'var(--bg-tertiary)',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      {evt.imageUrl ? (
                        <img 
                          src={evt.imageUrl} 
                          alt={evt.title} 
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
                          <Calendar size={48} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                        <span className={`badge ${catBadgeClass}`}>{evt.category}</span>
                      </div>
                      <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem' }}>
                        <span className={evt.isFull ? "badge badge-full" : "badge badge-active"} style={{ backgroundColor: 'var(--bg-primary)' }}>
                          {evt.isFull ? "FULL" : `${evt.seatsLeft} SEATS LEFT`}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                        {evt.title}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {evt.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Calendar size={14} style={{ color: 'var(--primary)' }} />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <MapPin size={14} style={{ color: '#ec4899' }} />
                          <span>{evt.venue}</span>
                        </div>
                      </div>

                      {/* Capacity progress */}
                      <div style={{ marginTop: 'auto', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Confirmed Capacity</span>
                          <span style={{ fontWeight: 700 }}>{evt.registeredCount} / {evt.capacity}</span>
                        </div>
                        <div className="progress-container">
                          <div className={`progress-bar ${progressClass}`} style={{ width: `${percentFull}%` }}></div>
                        </div>
                      </div>

                      <Link to={`/events/${evt._id}`} className="btn btn-outline" style={{ width: '100%' }}>
                        View Details & Register
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Highlights Banner */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-solid" style={{ marginBottom: '0.5rem' }}>Campus Ready</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Platform Highlights</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.25rem'
          }}>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius)',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}>
                <QrCode size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Verifiable Digital QR Passes
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Every registered student receives a ticket pass encoded with their registration ID, student name, and instant PNG download.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius)',
                background: 'var(--success-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Live Seat Availability
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  One-click registration automatically decrements available capacity. Overbooking and duplicate registrations are blocked server-side.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius)',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)'
              }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Admin Roster & CSV
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Full lifecycle event management, attendee roster inspection, and 1-click CSV spreadsheet roster downloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .hero-metrics {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
