
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', protect, async (req, res) => {
    try {
        const { shippingMethod } = req.body;

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

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // convert to cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: req.user._id.toString(),
                cartId: cart._id.toString()
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
