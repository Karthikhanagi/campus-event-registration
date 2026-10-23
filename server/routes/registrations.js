const express = require('express');
const router = express.Router();
const { Registration, Event } = require('../models');
const { requireAuth } = require('../middleware/auth');

// GET /api/registrations/me - View all registrations for logged-in student
router.get('/me', requireAuth, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.uid });

    // Populate event details if not already populated
    const populated = await Promise.all(
      registrations.map(async (reg) => {
        let event = reg.eventId;
        if (typeof event === 'string' || !event.title) {
          event = await Event.findById(reg.eventId);
        }
        return {
          _id: reg._id,
          ticketId: reg.ticketId,
          registeredAt: reg.registeredAt,
          userId: reg.userId,
          studentName: req.user.name,
          studentEmail: req.user.email,
          event: event || {
            _id: reg.eventId,
            title: 'Event Details Unavailable',
            category: 'General',
            date: 'N/A',
            time: 'N/A',
            venue: 'N/A'
          }
        };
      })
    );

    // Sort by registration date descending (newest first)
    populated.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    res.json(populated);
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    res.status(500).json({ error: 'Failed to retrieve registrations' });
  }
});

// DELETE /api/registrations/:id - Cancel a registration
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // Check if registration exists
    const dbData = await Registration.find();
    const reg = dbData.find(r => String(r._id) === String(req.params.id));

    if (!reg) {
      return res.status(404).json({ error: 'Registration record not found' });
    }

    // Authorization check: must be owner or admin
    if (reg.userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to cancel this registration' });
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Registration cancelled successfully. Your seat has been released.'
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

module.exports = router;
