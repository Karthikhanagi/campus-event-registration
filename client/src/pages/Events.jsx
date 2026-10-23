import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  X,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date-asc');

  const categories = [
    { name: 'All', badgeClass: 'btn-outline' },
    { name: 'Technical', badgeClass: 'badge-tech' },
    { name: 'Cultural', badgeClass: 'badge-cultural' },
    { name: 'Sports', badgeClass: 'badge-sports' },
    { name: 'Academic', badgeClass: 'badge-academic' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        if (selectedCategory !== 'All' && evt.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        if (upcomingOnly && evt.isPast) {
          return false;
        }

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchVenue = evt.venue.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchVenue) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time);
        }
        if (sortBy === 'date-desc') {
          return (b.date + ' ' + b.time).localeCompare(a.date + ' ' + a.time);
        }
        if (sortBy === 'seats-left') {
          return b.seatsLeft - a.seatsLeft;
        }
        if (sortBy === 'capacity-desc') {
          return b.capacity - a.capacity;
        }
        return 0;
      });
  }, [events, selectedCategory, upcomingOnly, searchTerm, sortBy]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.25rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          Explore Campus Events
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Discover academic symposia, coding hackathons, sports championships, and cultural festivities.
        </p>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'space-between'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            minWidth: '260px'
          }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--primary)'
              }} 
            />
            <input
              type="text"
              placeholder="Search by title, description, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: upcomingOnly ? 'var(--primary)' : 'transparent',
              color: upcomingOnly ? '#ffffff' : 'var(--text-primary)'
            }}>
              <input
                type="checkbox"
                checked={upcomingOnly}
                onChange={(e) => setUpcomingOnly(e.target.checked)}
                style={{ display: 'none' }}
              />
              <Clock size={15} />
              <span>Upcoming Only</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', fontSize: '0.85rem' }}
              >
                <option value="date-asc">Date: Soonest First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="seats-left">Most Seats Left</option>
                <option value="capacity-desc">Highest Capacity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={isSelected ? 'btn btn-primary btn-sm' : `btn btn-outline btn-sm ${cat.badgeClass}`}
                style={{
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <span>
          Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {upcomingOnly ? ' (Upcoming only)' : ''}
        </span>
        {(searchTerm || selectedCategory !== 'All' || upcomingOnly) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setUpcomingOnly(false);
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid-cols-auto-fit">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card" style={{ height: '390px', padding: '1.5rem' }}>
              <div className="skeleton" style={{ width: '100%', height: '180px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ width: '40%', height: '20px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton" style={{ width: '100%', height: '40px' }}></div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card" style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            color: 'var(--primary)'
          }}>
            <Calendar size={28} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Matching Events Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
            Try tweaking your search term, switching categories, or clearing the upcoming filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setUpcomingOnly(false);
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-cols-auto-fit">
          {filteredEvents.map((evt) => {
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
                {/* Full Color Image Banner */}
                <div style={{
                  height: '200px',
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

                  {/* Badges on Banner */}
                  <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                    <span className={`badge ${catBadgeClass}`}>{evt.category}</span>
                  </div>

                  <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem' }}>
                    {evt.isPast ? (
                      <span className="badge badge-muted" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        CONCLUDED
                      </span>
                    ) : evt.isFull ? (
                      <span className="badge badge-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        SOLD OUT
                      </span>
                    ) : (
                      <span className="badge badge-active" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        {evt.seatsLeft} SEATS LEFT
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
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

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={14} style={{ color: '#ec4899' }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.venue}
                      </span>
                    </div>
                  </div>

                  {/* Colored Progress Bar */}
                  <div style={{ marginTop: 'auto', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Registered</span>
                      <span style={{ fontWeight: 700 }}>{evt.registeredCount} / {evt.capacity}</span>
                    </div>
                    <div className="progress-container">
                      <div className={`progress-bar ${progressClass}`} style={{ width: `${percentFull}%` }}></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <Link to={`/events/${evt._id}`} className="btn btn-outline" style={{ width: '100%' }}>
                    <span>Event Details</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
