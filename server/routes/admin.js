const express = require('express');
const router = express.Router();
const { Event, Registration } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats - Live dashboard metrics
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Total Events
    const totalEvents = await Event.countDocuments();

    // 2. Total Registrations
    const totalRegistrations = await Registration.countDocuments();

    // 3. Upcoming Events (date >= today)
    const upcomingEvents = await Event.countDocuments({ date: { $gte: todayStr } });

    // 4. Today's Registrations
    const todaysRegistrations = await Registration.countDocuments({
      registeredAt: { $gte: `${todayStr}T00:00:00.000Z` }
    });

    // Additional breakdown by category for admin intelligence
    const allEvents = await Event.find();
    const categoryStats = {
      Technical: allEvents.filter(e => e.category === 'Technical').length,
      Cultural: allEvents.filter(e => e.category === 'Cultural').length,
      Sports: allEvents.filter(e => e.category === 'Sports').length,
      Academic: allEvents.filter(e => e.category === 'Academic').length
    };

    res.json({
      totalEvents,
      totalRegistrations,
      upcomingEvents,
      todaysRegistrations,
      categoryStats
    });
  } catch (error) {
    console.error('Error computing admin statistics:', error);
    res.status(500).json({ error: 'Failed to compute dashboard metrics' });
  }
});

module.exports = router;
