import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

export const products = [
  // HOT DRINKS (10)
  {
    name: "Classic Espresso",
    description: "A rich and bold shot of pure coffee essence, extracted from our premium dark roast beans.",
    price: 3.50,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    stock: 100,
    featured: true,
    specs: {
      "Roast": "Dark",
      "Size": "Single Shot",
      "Origin": "Colombia, Brazil blend"
    },
    colors: []
  },
  {
    name: "Velvet Latte",
    description: "Smooth espresso blanketed with steamed milk and a light layer of foam.",
    price: 4.75,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 100,
    featured: true,
    specs: {
      "Roast": "Medium",
      "Size": "12 oz",
      "Milk": "Whole Milk (options available)"
    },
    colors: []
  },
  {
    name: "Artisan Cappuccino",
    description: "Equal parts espresso, steamed milk, and rich foam, finished with a dash of cocoa.",
    price: 4.50,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 100,
    featured: false,
    specs: {
      "Roast": "Medium",
      "Size": "12 oz"
    },
    colors: []
  },
  {
    name: "Vanilla Bean Macchiato",
    description: "Steamed milk flavored with real vanilla bean, marked with a shot of espresso.",
    price: 5.25,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 80,
    featured: false,
    specs: {
      "Roast": "Medium",
      "Size": "16 oz",
      "Flavor": "Vanilla"
    },
    colors: []
  },
  {
    name: "Mocha Delight",
    description: "Espresso combined with rich chocolate syrup and steamed milk.",
    price: 5.50,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1558223637-2cebe96deee2?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1558223637-2cebe96deee2?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 90,
    featured: true,
    specs: {
      "Roast": "Medium",
      "Size": "16 oz",
      "Chocolate": "Dark Dutch Cocoa"
    },
    colors: []
  },
  {
    name: "Matcha Green Tea Latte",
    description: "Premium Japanese matcha green tea blended with steamed milk.",
    price: 5.75,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1536556482643-fc052e46b0ab?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1536556482643-fc052e46b0ab?auto=format&fit=crop&w=800&q=80"],
    rating: 4.5,
    stock: 60,
    featured: false,
    specs: {
      "Origin": "Uji, Japan",
      "Size": "12 oz"
    },
    colors: []
  },
  {
    name: "Chai Tea Latte",
    description: "Spiced black tea infused with cinnamon, clove, and cardamom, mixed with steamed milk.",
    price: 4.95,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1558223637-5de96c6d05da?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1558223637-5de96c6d05da?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 75,
    featured: false,
    specs: {
      "Blend": "House Spiced",
      "Size": "16 oz"
    },
    colors: []
  },
  {
    name: "Pour Over Coffee",
    description: "Single-origin coffee hand-poured for exceptional clarity and flavor control.",
    price: 4.50,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 50,
    featured: true,
    specs: {
      "Roast": "Light/Medium",
      "Size": "12 oz",
      "Origin": "Ethiopia Yirgacheffe"
    },
    colors: []
  },
  {
    name: "Americano",
    description: "A rich shot of espresso poured over hot water for a smooth, bold cup.",
    price: 3.75,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80"],
    rating: 4.4,
    stock: 100,
    featured: false,
    specs: {
      "Roast": "Dark",
      "Size": "12 oz"
    },
    colors: []
  },
  {
    name: "London Fog",
    description: "Earl grey tea steeped in steamed milk with a hint of vanilla.",
    price: 4.85,
    category: "Hot Drinks",
    image: "https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 70,
    featured: false,
    specs: {
      "Tea": "Earl Grey",
      "Size": "16 oz"
    },
    colors: []
  },

  // COLD DRINKS (8)
  {
    name: "Cold Brew Reserve",
    description: "Slow-steeped for 24 hours for a super smooth, less acidic iced coffee.",
    price: 4.95,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1461023058943-0708ce153722?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1461023058943-0708ce153722?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 80,
    featured: true,
    specs: {
      "Roast": "Medium-Dark",
      "Size": "16 oz",
      "Steep Time": "24 Hours"
    },
    colors: []
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Espresso combined with vanilla, milk, and ice, topped with a caramel drizzle.",
    price: 5.50,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1582283086968-301777b7fcc7?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1582283086968-301777b7fcc7?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 90,
    featured: true,
    specs: {
      "Roast": "Medium",
      "Size": "16 oz",
      "Flavor": "Vanilla/Caramel"
    },
    colors: []
  },
  {
    name: "Iced Latte",
    description: "Freshly pulled espresso poured over cold milk and ice.",
    price: 4.75,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1517701550927-30cfcb64db10?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1517701550927-30cfcb64db10?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 100,
    featured: false,
    specs: {
      "Roast": "Medium",
      "Size": "16 oz"
    },
    colors: []
  },
  {
    name: "Nitro Cold Brew",
    description: "Our signature cold brew infused with nitrogen for a sweet flavor and creamy cascade.",
    price: 5.50,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 60,
    featured: false,
    specs: {
      "Roast": "Medium-Dark",
      "Size": "16 oz",
      "Texture": "Creamy/Velvety"
    },
    colors: []
  },
  {
    name: "Iced Matcha Latte",
    description: "Premium matcha green tea served cold over milk and ice.",
    price: 5.75,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1588661858222-19e599e8d1ee?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1588661858222-19e599e8d1ee?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 70,
    featured: true,
    specs: {
      "Origin": "Uji, Japan",
      "Size": "16 oz"
    },
    colors: []
  },
  {
    name: "Frappe Sunrise",
    description: "Blended iced coffee with a shot of espresso and a hint of hazelnut.",
    price: 5.95,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"],
    rating: 4.5,
    stock: 80,
    featured: false,
    specs: {
      "Flavor": "Hazelnut",
      "Size": "16 oz"
    },
    colors: []
  },
  {
    name: "Iced Peach Tea",
    description: "Refreshing black tea blended with sweet peach nectar over ice.",
    price: 3.95,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80", // Using a placeholder that works
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"],
    rating: 4.4,
    stock: 90,
    featured: false,
    specs: {
      "Tea": "Black Tea",
      "Size": "16 oz"
    },
    colors: []
  },
  {
    name: "Sparkling Espresso",
    description: "A double shot of espresso poured over sparkling water and ice, with a twist of lemon.",
    price: 4.25,
    category: "Cold Drinks",
    image: "https://images.unsplash.com/photo-1574545084988-cb754cbdd0e4?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1574545084988-cb754cbdd0e4?auto=format&fit=crop&w=800&q=80"],
    rating: 4.3,
    stock: 50,
    featured: false,
    specs: {
      "Roast": "Medium",
      "Size": "12 oz",
      "Base": "Sparkling Water"
    },
    colors: []
  },

  // PASTRIES & TREATS (6)
  {
    name: "Butter Croissant",
    description: "Flaky, buttery, traditional French pastry baked fresh daily.",
    price: 3.50,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 50,
    featured: true,
    specs: {
      "Type": "Viennoiserie",
      "Allergens": "Dairy, Wheat"
    },
    colors: []
  },
  {
    name: "Almond Croissant",
    description: "Twice-baked croissant filled with sweet almond frangipane and topped with sliced almonds.",
    price: 4.25,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1623366302587-bca23214daaa?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1623366302587-bca23214daaa?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 40,
    featured: true,
    specs: {
      "Type": "Viennoiserie",
      "Allergens": "Dairy, Wheat, Tree Nuts"
    },
    colors: []
  },
  {
    name: "Blueberry Muffin",
    description: "Moist muffin bursting with wild blueberries and topped with a streusel crumb.",
    price: 3.75,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1596700030097-f5dc81dfec30?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1596700030097-f5dc81dfec30?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 60,
    featured: false,
    specs: {
      "Type": "Muffin",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "Chocolate Chunk Scone",
    description: "Tender, flaky scone studded with huge chunks of dark chocolate.",
    price: 3.95,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1589417070183-b097b399201f?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1589417070183-b097b399201f?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 45,
    featured: false,
    specs: {
      "Type": "Scone",
      "Allergens": "Dairy, Wheat"
    },
    colors: []
  },
  {
    name: "Cinnamon Roll",
    description: "Warm, gooey cinnamon roll topped with rich cream cheese frosting.",
    price: 4.50,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 30,
    featured: true,
    specs: {
      "Type": "Sweet Roll",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "Cheese Danish",
    description: "Flaky pastry dough with a sweet cream cheese center.",
    price: 3.95,
    category: "Pastries & Treats",
    image: "https://images.unsplash.com/photo-1623366302587-bca23214daaa?auto=format&fit=crop&w=800&q=80", // Using a placeholder that works
    images: ["https://images.unsplash.com/photo-1623366302587-bca23214daaa?auto=format&fit=crop&w=800&q=80"],
    rating: 4.5,
    stock: 35,
    featured: false,
    specs: {
      "Type": "Danish",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },

  // LIGHT BITES (5)
  {
    name: "Avocado Toast",
    description: "Mashed avocado on toasted artisan sourdough bread with radishes and microgreens.",
    price: 7.50,
    category: "Light Bites",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 30,
    featured: true,
    specs: {
      "Type": "Breakfast/Brunch",
      "Dietary": "Vegan Friendly",
      "Allergens": "Wheat"
    },
    colors: []
  },
  {
    name: "Bacon & Egg Sandwich",
    description: "Crispy bacon, fried egg, and cheddar cheese on a toasted brioche bun.",
    price: 6.95,
    category: "Light Bites",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 45,
    featured: false,
    specs: {
      "Type": "Breakfast Sandwich",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "Classic Bagel with Cream Cheese",
    description: "Toasted New York style bagel with a generous spread of plain cream cheese.",
    price: 3.95,
    category: "Light Bites",
    image: "https://images.unsplash.com/photo-1585648589091-7f8fed4e0315?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585648589091-7f8fed4e0315?auto=format&fit=crop&w=800&q=80"],
    rating: 4.5,
    stock: 50,
    featured: false,
    specs: {
      "Type": "Breakfast",
      "Allergens": "Dairy, Wheat"
    },
    colors: []
  },
  {
    name: "Turkey & Swiss Panini",
    description: "Roasted turkey breast, swiss cheese, and pesto pressed on artisan bread.",
    price: 8.50,
    category: "Light Bites",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 25,
    featured: false,
    specs: {
      "Type": "Lunch",
      "Allergens": "Dairy, Wheat"
    },
    colors: []
  },
  {
    name: "Spinach Feta Wrap",
    description: "Scrambled eggs, spinach, and feta cheese in a whole wheat wrap.",
    price: 6.50,
    category: "Light Bites",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"],
    rating: 4.4,
    stock: 35,
    featured: false,
    specs: {
      "Type": "Breakfast Wrap",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },

  // DESSERTS & SWEET TREATS (5)
  {
    name: "Classic Tiramisu",
    description: "Layers of espresso-soaked ladyfingers and rich mascarpone cream.",
    price: 6.50,
    category: "Desserts & Sweet Treats",
    image: "https://images.unsplash.com/photo-1571115177098-24de84b4226d?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1571115177098-24de84b4226d?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    stock: 20,
    featured: true,
    specs: {
      "Type": "Dessert",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "Fudge Brownie",
    description: "Decadent, dense chocolate brownie with chocolate chunks.",
    price: 3.50,
    category: "Desserts & Sweet Treats",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 40,
    featured: true,
    specs: {
      "Type": "Baked Good",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "New York Cheesecake",
    description: "Rich and creamy NY style cheesecake on a graham cracker crust.",
    price: 5.95,
    category: "Desserts & Sweet Treats",
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    stock: 25,
    featured: false,
    specs: {
      "Type": "Dessert Cake",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  },
  {
    name: "Macarons (Box of 3)",
    description: "Assorted French macarons (Vanilla, Chocolate, Raspberry).",
    price: 6.00,
    category: "Desserts & Sweet Treats",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    stock: 50,
    featured: false,
    specs: {
      "Type": "Cookie",
      "Allergens": "Dairy, Eggs, Tree Nuts"
    },
    colors: []
  },
  {
    name: "Lemon Tart",
    description: "Zesty lemon curd in a buttery, sweet pastry shell.",
    price: 4.95,
    category: "Desserts & Sweet Treats",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20a1b?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1519915028121-7d3463d20a1b?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    stock: 30,
    featured: false,
    specs: {
      "Type": "Tart",
      "Allergens": "Dairy, Wheat, Eggs"
    },
    colors: []
  }
];

export const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB Connected');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Check if running directly
const isMainModule = process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMainModule) {
  seedProducts();
}