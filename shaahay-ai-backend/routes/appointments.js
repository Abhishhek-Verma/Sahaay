const express = require('express');
const { requireAuth, attachUser, requireRole } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const router = express.Router();

// Create appointment (student only)
router.post('/', requireAuth, attachUser, requireRole('student'), async (req, res) => {
  try {
    const { counselorId, scheduledDate, type, reason } = req.body;

    // Verify counselor exists
    const counselor = await User.findOne({ 
      clerkId: counselorId, 
      role: 'counselor',
      isActive: true 
    });

    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found' });
    }

    // Check for existing appointment at this time
    const existingAppointment = await Appointment.findOne({
      counselorId,
      scheduledDate,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      studentId: req.user.clerkId,
      counselorId,
      scheduledDate,
      type: type || 'individual',
      reason,
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get appointments (role-based)
router.get('/', requireAuth, attachUser, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    // Filter by role
    if (req.user.role === 'student') {
      query.studentId = req.user.clerkId;
    } else if (req.user.role === 'counselor') {
      query.counselorId = req.user.clerkId;
    }
    // Admin sees all appointments

    if (status) query.status = status;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .sort({ scheduledDate: 1 });

    // Populate user details
    const populatedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        const student = await User.findOne({ clerkId: apt.studentId }).select('name email avatar');
        const counselor = await User.findOne({ clerkId: apt.counselorId }).select('name email avatar specialization');
        
        return {
          ...apt.toObject(),
          student,
          counselor
        };
      })
    );

    res.json({ appointments: populatedAppointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get single appointment
router.get('/:id', requireAuth, attachUser, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.studentId === req.user.clerkId ||
      appointment.counselorId === req.user.clerkId;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await User.findOne({ clerkId: appointment.studentId }).select('name email avatar');
    const counselor = await User.findOne({ clerkId: appointment.counselorId }).select('name email avatar specialization');

    res.json({ 
      appointment: {
        ...appointment.toObject(),
        student,
        counselor
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Update appointment status
router.patch('/:id/status', requireAuth, attachUser, async (req, res) => {
  try {
    const { status, notes, rating, feedback } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    const canUpdate = 
      req.user.role === 'admin' ||
      (req.user.role === 'counselor' && appointment.counselorId === req.user.clerkId) ||
      (req.user.role === 'student' && appointment.studentId === req.user.clerkId && ['cancelled'].includes(status));

    if (!canUpdate) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (rating) appointment.rating = rating;
    if (feedback) appointment.feedback = feedback;

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment
router.delete('/:id', requireAuth, attachUser, async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    const canCancel = 
      appointment.studentId === req.user.clerkId ||
      appointment.counselorId === req.user.clerkId ||
      req.user.role === 'admin';

    if (!canCancel) {
      return res.status(403).json({ error: 'Access denied' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = cancelReason;
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router;
