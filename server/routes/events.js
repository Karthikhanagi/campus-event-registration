const express = require('express');
const router = express.Router();
const { Event, Registration, User } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Helper to determine if date is in the past
function isDatePast(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
}

// GET /api/events - List events with search, category & upcoming filters
router.get('/', async (req, res) => {
  try {
    const { search, category, upcoming } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query.date = { $gte: today };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { venue: regex }
      ];
    }

    const events = await Event.find(query);

    // Compute live registration counts for each event
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const eventObj = event.toObject ? event.toObject() : { ...event };
        const registeredCount = await Registration.countDocuments({ eventId: String(event._id) });
        const seatsLeft = Math.max(0, event.capacity - registeredCount);
        const isFull = registeredCount >= event.capacity;
        const isPast = isDatePast(event.date);

        return {
          ...eventObj,
          registeredCount,
          seatsLeft,
          isFull,
          isPast
        };
      })
    );

    res.json(enrichedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventObj = event.toObject ? event.toObject() : { ...event };
    const registeredCount = await Registration.countDocuments({ eventId: String(event._id) });
    const seatsLeft = Math.max(0, event.capacity - registeredCount);
    const isFull = registeredCount >= event.capacity;
    const isPast = isDatePast(event.date);

    // Check if user is logged in and already registered
    let userRegistration = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.uid) {
          userRegistration = await Registration.findOne({
            eventId: String(event._id),
            userId: decoded.uid
          });
        }
      } catch (e) {
        // Ignore unverified token for optional check
      }
    }

    res.json({
      ...eventObj,
      registeredCount,
      seatsLeft,
      isFull,
      isPast,
      userRegistration: userRegistration || null
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Failed to load event details' });
  }
});

// POST /api/events - Create new event (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity, imageUrl } = req.body;

    if (!title || !description || !category || !date || !time || !venue || capacity === undefined) {
      return res.status(400).json({ error: 'All required event fields must be filled' });
    }

    const validCategories = ['Technical', 'Cultural', 'Sports', 'Academic'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
    }

    const numCapacity = parseInt(capacity, 10);
    if (isNaN(numCapacity) || numCapacity <= 0) {
      return res.status(400).json({ error: 'Capacity must be a positive number greater than 0' });
    }

    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      time,
      venue: venue.trim(),
      capacity: numCapacity,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      createdBy: req.user.email || req.user.name || 'Admin'
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity, imageUrl } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (capacity !== undefined) {
      const numCapacity = parseInt(capacity, 10);
      if (isNaN(numCapacity) || numCapacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be a positive integer' });
      }
    }

    const updatedData = {
      ...(title && { title: title.trim() }),
      ...(description && { description: description.trim() }),
      ...(category && { category }),
      ...(date && { date }),
      ...(time && { time }),
      ...(venue && { venue: venue.trim() }),
      ...(capacity !== undefined && { capacity: parseInt(capacity, 10) }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() })
    };

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event and remove its registrations (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove event
    await Event.findByIdAndDelete(req.params.id);

    // Cascading delete: Remove all registrations for this event
    const regResult = await Registration.deleteMany({ eventId: String(req.params.id) });

    res.json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
      deletedRegistrationsCount: regResult.deletedCount || 0
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// POST /api/events/:id/register - Register for event (Student)
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 1. Block registration if event date is past
    if (isDatePast(event.date)) {
      return res.status(400).json({ error: 'Cannot register for an event that has already occurred' });
    }

    // 2. Prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      eventId: String(event._id),
      userId: req.user.uid
    });

    if (existingRegistration) {
      return res.status(400).json({
        error: 'You have already registered for this event',
        ticketId: existingRegistration.ticketId
      });
    }

    // 3. Block registration if event is at capacity
    const currentRegisteredCount = await Registration.countDocuments({ eventId: String(event._id) });
    if (currentRegisteredCount >= event.capacity) {
      return res.status(400).json({ error: 'This event has reached full capacity. Registrations are closed.' });
    }

    // Generate unique Ticket ID: TKT-[CAT]-[YYMM]-[4 random chars]
    const catCode = (event.category || 'EVT').substring(0, 3).toUpperCase();
    const cleanDate = (event.date || '').replace(/-/g, '').substring(2, 6);
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketId = `TKT-${catCode}-${cleanDate}-${randCode}`;

    const registration = await Registration.create({
      eventId: String(event._id),
      userId: req.user.uid,
      registeredAt: new Date().toISOString(),
      ticketId
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event!',
      registration: {
        ...registration,
        eventTitle: event.title,
        ticketId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
});

// GET /api/events/:id/participants - View registered participants (Admin only)
router.get('/:id/participants', requireAuth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrations = await Registration.find({ eventId: String(event._id) });
    const allUsers = await User.find();
    const userMap = new Map();
    allUsers.forEach(u => {
      userMap.set(u.uid, u);
      if (u.email) userMap.set(u.email, u);
    });

    // Enrich registrations with student profile
    const participants = registrations.map(reg => {
      const user = userMap.get(reg.userId);
      return {
        registrationId: reg._id,
        ticketId: reg.ticketId,
        registeredAt: reg.registeredAt,
        userId: reg.userId,
        name: user ? user.name : 'Registered Student',
        email: user ? user.email : 'student@college.edu'
      };
    });

    res.json({
      event: {
        _id: event._id,
        title: event.title,
        category: event.category,
        date: event.date,
        time: event.time,
        venue: event.venue,
        capacity: event.capacity,
        totalParticipants: participants.length
      },
      participants
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to retrieve event participants' });
  }
});

module.exports = router;
