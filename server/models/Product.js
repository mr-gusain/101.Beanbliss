import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		discountPrice: {
			type: Number,
			min: 0,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"Hot Drinks",
				"Cold Drinks",
				"Pastries & Treats",
				"Light Bites",
				"Desserts & Sweet Treats",
			],
		},
		image: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		stock: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		specs: {
			type: Map,
			of: String,
		},
		colors: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	},
);

const Product = mongoose.model("Product", productSchema);

export default Product;
