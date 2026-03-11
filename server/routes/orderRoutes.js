import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id firstName lastName email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { shippingInfo, shippingMethod, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Filter out items where the product no longer exists
    const validItems = cart.items.filter(item => item.product != null);
    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Cart contains no valid products. Please clear your cart and try again.' });
    }

    // Calculate costs using only valid items
    const subtotal = validItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const shippingCosts = {
      standard: 10,
      priority: 20,
      express: 35
    };

    const shippingCost = shippingCosts[shippingMethod] || 10;
    const taxAmount = subtotal * 0.085;
    const total = subtotal + shippingCost + taxAmount;

    // Check stock availability
    for (const item of validItems) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product?.name || 'a product'}`
        });
      }
    }

    // Determine payment status based on method
    let paymentStatus = 'Pending';
    if (paymentMethod === 'Card') {
      // For card, assume payment is processed immediately
      paymentStatus = 'Paid';
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: validItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingInfo,
      shippingMethod,
      shippingCost,
      taxAmount,
      subtotal,
      total,
      paymentMethod,
      paymentStatus
    });

    // Update product stock
    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    const savedOrder = await order.save();
    await savedOrder.populate('items.product');

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;