import Product from '../models/Product.js';

// Dynamically import OpenAI only when needed
let OpenAI;

export const chatWithAI = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Messages array is required" });
        }

        const latestUserMessage = messages[messages.length - 1]?.content || '';

        // Fetch products for context (used by both AI and offline mode)
        let products = [];
        try {
            products = await Product.find({})
                .select('name price category stock description rating')
                .limit(20)
                .lean();
        } catch (dbErr) {
            console.warn('Could not fetch products for AI context:', dbErr.message);
        }

        // Build user context
        let userContext = "User is a guest.";
        if (req.user) {
            userContext = `User: ${req.user.firstName || req.user.name} (${req.user.email}).`;
        }

        // ---- Try OpenAI if key is available ----
        const apiKey = process.env.OPENAI_API_KEY;
        const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.includes('your_openai');

        if (hasValidKey) {
            try {
                if (!OpenAI) {
                    const mod = await import('openai');
                    OpenAI = mod.default;
                }

                const openai = new OpenAI({ apiKey });

                const productContext = products.map(p =>
                    `- ${p.name} ($${p.price}): ${p.description?.substring(0, 100) || 'No description'}... (Stock: ${p.stock}, Rating: ${p.rating}/5)`
                ).join('\n');

                const systemMessage = {
                    role: 'system',
                    content: `You are the 1NonlyStore AI Assistant, a helpful and knowledgeable shopping assistant for a premium electronics store.

Your capabilities:
1. Recommend products based on user needs.
2. Answer questions about product specifications, price, and availability.
3. Assist with account-related questions.
4. Provide general support about shipping, returns (standard 30-day policy), and payment methods (Stripe, Credit Card).

Top Products Available:
${productContext}

Current User Context:
${userContext}

Tone: Professional, friendly, and enthusiastic. Keep responses concise (under 3-4 sentences) unless detailed explanation is needed. Do not invent products not in the list.`
                };

                const conversationHistory = [systemMessage, ...messages.slice(-10)];

                const completion = await openai.chat.completions.create({
                    messages: conversationHistory,
                    model: 'gpt-3.5-turbo',
                });

                return res.json({ message: completion.choices[0].message });

            } catch (aiError) {
                console.warn('OpenAI call failed, falling back to offline mode:', aiError.code || aiError.message);
                // Fall through to offline mode below
            }
        }

        // ---- Offline Smart Mode (no API key or API call failed) ----
        const reply = generateOfflineResponse(latestUserMessage, products, userContext);
        return res.json({
            message: { role: 'assistant', content: reply }
        });

    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ message: "I'm having trouble connecting right now. Please try again later." });
    }
};

// Smart offline response generator that uses actual product data
function generateOfflineResponse(userMessage, products, userContext) {
    const msg = userMessage.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|howdy|greetings|yo|sup)/i.test(msg)) {
        return "👋 Hello! Welcome to 1NonlyStore! I can help you find the perfect tech product. Ask me about our Smartphones, Laptops, Audio gear, Wearables, or Accessories!";
    }

    // Shipping
    if (msg.includes('shipping') || msg.includes('delivery') || msg.includes('ship')) {
        return "🚚 We offer free standard shipping on orders over $50! Standard delivery takes 3-5 business days, and express delivery is available for 1-2 business days at a small fee.";
    }

    // Returns
    if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
        return "🔄 We have a hassle-free 30-day return policy! Items must be in their original condition with packaging. Refunds are processed within 5-7 business days after we receive your return.";
    }

    // Payment
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('stripe') || msg.includes('card') || msg.includes('cod')) {
        return "💳 We accept Credit/Debit cards via Stripe and Cash on Delivery (COD). All transactions are 100% secure and encrypted!";
    }

    // Contact / Support
    if (msg.includes('contact') || msg.includes('support') || msg.includes('email') || msg.includes('call')) {
        return "📧 You can reach our support team at support@1nonlystore.com. We typically respond within 24 hours!";
    }

    // Account
    if (msg.includes('account') || msg.includes('profile') || msg.includes('password') || msg.includes('login') || msg.includes('sign')) {
        if (userContext.includes('guest')) {
            return "👤 You're currently browsing as a guest. Create an account to track orders, save addresses, and get personalized recommendations! Head to the Sign Up page to get started.";
        }
        return "👤 You can manage your account by clicking your profile icon in the top-right corner. From there you can update your profile, view orders, and manage addresses.";
    }

    // Order tracking
    if (msg.includes('order') || msg.includes('track') || msg.includes('status')) {
        return "📦 You can track your orders from 'My Account > My Orders'. Each order has a status that updates as it progresses through processing, shipping, and delivery.";
    }

    // Category-based product recommendations
    const categoryMap = {
        smartphones: ['phone', 'smartphone', 'mobile', 'iphone', 'samsung', 'pixel'],
        laptops: ['laptop', 'computer', 'macbook', 'notebook', 'pc'],
        audio: ['audio', 'headphone', 'earphone', 'speaker', 'earbuds', 'airpod', 'sound', 'music'],
        wearables: ['watch', 'wearable', 'fitness', 'smartwatch', 'band', 'tracker'],
        accessories: ['accessory', 'accessories', 'charger', 'cable', 'case', 'cover', 'adapter']
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(kw => msg.includes(kw))) {
            const categoryProducts = products.filter(p => p.category === category);
            if (categoryProducts.length > 0) {
                const topProducts = categoryProducts.slice(0, 3).map(p =>
                    `• **${p.name}** — $${p.price}${p.stock > 0 ? ' ✅ In Stock' : ' ❌ Out of Stock'}`
                ).join('\n');
                return `Here are our top ${category}:\n\n${topProducts}\n\nWould you like more details on any of these? Visit the Products page to see the full collection!`;
            }
            return `We have a great selection of ${category}! Check out our Products page to browse the full collection.`;
        }
    }

    // Price related
    if (msg.includes('price') || msg.includes('cost') || msg.includes('cheap') || msg.includes('budget') || msg.includes('expensive') || msg.includes('deal')) {
        const sorted = [...products].sort((a, b) => a.price - b.price);
        if (sorted.length > 0) {
            const affordable = sorted.slice(0, 3).map(p => `• **${p.name}** — $${p.price}`).join('\n');
            return `💰 Looking for great deals? Here are our most affordable products:\n\n${affordable}\n\nCheck the Products page for all our offers!`;
        }
        return "💰 We have products at every price point! Browse our Products page to find the perfect match for your budget.";
    }

    // Product recommendation 
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('popular') || msg.includes('top')) {
        const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
        if (topRated.length > 0) {
            const recs = topRated.map(p => `• **${p.name}** — $${p.price} (⭐ ${p.rating}/5)`).join('\n');
            return `🌟 Here are our top-rated products:\n\n${recs}\n\nWould you like to know more about any of these?`;
        }
        return "🌟 Check out our featured products on the homepage for our top picks!";
    }

    // Thank you
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('thx')) {
        return "😊 You're welcome! Happy to help. Let me know if you have any other questions!";
    }

    // Fallback
    return "I'd love to help! You can ask me about:\n\n🛒 **Products** — Smartphones, Laptops, Audio, Wearables, Accessories\n🚚 **Shipping** — Delivery times and costs\n🔄 **Returns** — Our 30-day return policy\n💳 **Payments** — Accepted payment methods\n👤 **Account** — Profile and order management\n\nWhat would you like to know?";
}
