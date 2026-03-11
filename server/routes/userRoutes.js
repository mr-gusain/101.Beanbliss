import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ================= ADDRESSES ROUTES =================

// @route   POST /api/users/addresses
// @desc    Add address
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/users/addresses/:id
// @desc    Update address
// @access  Private
router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Since we're embedded, we can update directly
    // If isDefault is being set to true, we might want to unset others?
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== req.params.id) {
          addr.isDefault = false;
        }
      });
    }

    Object.assign(address, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.id);
    await user.save();
    res.json(user.addresses); // Return updated list
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ================= PAYMENT METHODS ROUTES =================

// @route   POST /api/users/payment-methods
// @desc    Add payment method
// @access  Private
router.post('/payment-methods', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.isDefault) {
      user.paymentMethods.forEach(pm => pm.isDefault = false);
    }

    user.paymentMethods.push(req.body);
    await user.save();
    res.json(user.paymentMethods);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/payment-methods/:id
// @desc    Delete payment method
// @access  Private
router.delete('/payment-methods/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.paymentMethods.pull(req.params.id);
    await user.save();
    res.json(user.paymentMethods);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ================= NOTIFICATIONS ROUTES =================

// @route   PUT /api/users/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.id);

    if (notification) {
      notification.read = true;
      await user.save();
    }
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/users/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications.forEach(notif => notif.read = true);
    await user.save();
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications.pull(req.params.id);
    await user.save();
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/notifications
// @desc    Clear all notifications
// @access  Private
router.delete('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications = [];
    await user.save();
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
