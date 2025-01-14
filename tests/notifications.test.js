const request = require('supertest');
const app = require('../server');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { generateToken } = require('../utils/authUtils');

describe('Wishlist Notifications', () => {
    let token;
    let user;
    let product;

    beforeAll(async () => {
        // Create test user
        user = await User.create({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123'
        });

        // Create test product
        product = await Product.create({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            stockQuantity: 10,
            category: 'test',
            brand: 'test'
        });

        token = generateToken(user._id);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
    });

    it('should detect price drops', async () => {
        // 1. Add item to wishlist
        await request(app)
            .post('/api/wishlist')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: product._id });

        // 2. Update product price
        await Product.findByIdAndUpdate(product._id, {
            price: 79.99
        });

        // 3. Check notifications
        const res = await request(app)
            .get('/api/wishlist/notifications')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.notifications).toHaveLength(1);
        expect(res.body.data.notifications[0].type).toBe('PRICE_DROP');
        expect(res.body.data.notifications[0].difference).toBe(20);
    });

    it('should detect out of stock', async () => {
        // Update product stock to 0
        await Product.findByIdAndUpdate(product._id, {
            stockQuantity: 0
        });

        const res = await request(app)
            .get('/api/wishlist/notifications')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.notifications).toHaveLength(1);
        expect(res.body.data.notifications[0].type).toBe('OUT_OF_STOCK');
    });

    it('should detect back in stock', async () => {
        // Update product stock back to positive
        await Product.findByIdAndUpdate(product._id, {
            stockQuantity: 5
        });

        const res = await request(app)
            .get('/api/wishlist/notifications')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.notifications).toHaveLength(1);
        expect(res.body.data.notifications[0].type).toBe('BACK_IN_STOCK');
        expect(res.body.data.notifications[0].stockQuantity).toBe(5);
    });
}); 