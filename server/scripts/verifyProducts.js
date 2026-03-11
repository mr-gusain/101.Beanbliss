import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const verifyProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const count = await Product.countDocuments();
        console.log(`Total Products in DB: ${count}`);

        const categories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        console.log('Breakdown by Category:');
        categories.forEach(cat => {
            console.log(`- ${cat._id}: ${cat.count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error verifying products:', error);
        process.exit(1);
    }
};

verifyProducts();
