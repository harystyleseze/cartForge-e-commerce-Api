// Test file for wishlist

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { generateToken } = require('../utils/authUtils');

describe('Wishlist API', () => {
    let token;
    let user;
    let product;
    let product2;

    beforeAll(async () => {
        // Create test user
        user = await User.create({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123'
        });

        // Create test products
        product = await Product.create({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            stockQuantity: 10,
            category: new mongoose.Types.ObjectId(),
            brand: new mongoose.Types.ObjectId()
        });

        product2 = await Product.create({
            name: 'Test Product 2',
            description: 'Test Description 2',
            price: 149.99,
            stockQuantity: 5,
            category: new mongoose.Types.ObjectId(),
            brand: new mongoose.Types.ObjectId()
        });

        token = generateToken(user._id);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Wishlist.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Wishlist.deleteMany({}); // Clear wishlist before each test
    });

    describe('POST /api/wishlist', () => {
        it('should add item to wishlist', async () => {
            const res = await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });

            expect(res.status).toBe(201);
            expect(res.body.data.wishlist.items).toHaveLength(1);
            expect(res.body.data.wishlist.items[0].productId.toString()).toBe(product._id.toString());
        });

        it('should not add duplicate item to wishlist', async () => {
            // First add
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });

            // Try to add same product again
            const res = await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Product already in wishlist');
        });

        it('should return error for non-existent product', async () => {
            const res = await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: new mongoose.Types.ObjectId() });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Product not found');
        });

        it('should add item with note to wishlist', async () => {
            const res = await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ 
                    productId: product._id,
                    note: 'Birthday gift idea'
                });

            expect(res.status).toBe(201);
            expect(res.body.data.wishlist.items).toHaveLength(1);
            expect(res.body.data.wishlist.items[0].note).toBe('Birthday gift idea');
        });
    });

    describe('GET /api/wishlist', () => {
        beforeEach(async () => {
            // Add items to wishlist
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });
        });

        it('should get user wishlist', async () => {
            const res = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.total).toBe(1);
        });

        it('should support pagination', async () => {
            // Add another product
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product2._id });

            const res = await request(app)
                .get('/api/wishlist?page=1&limit=1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.total).toBe(2);
        });
    });

    describe('DELETE /api/wishlist/:productId', () => {
        beforeEach(async () => {
            // Add item to wishlist
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });
        });

        it('should remove item from wishlist', async () => {
            const res = await request(app)
                .delete(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.wishlist.items).toHaveLength(0);
        });

        it('should handle removal of non-existent item', async () => {
            const res = await request(app)
                .delete(`/api/wishlist/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            // Should not modify existing items
            expect(res.body.data.wishlist.items).toHaveLength(1);
        });
    });

    describe('PATCH /api/wishlist/:productId', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ 
                    productId: product._id,
                    note: 'Initial note'
                });
        });

        it('should update wishlist item note', async () => {
            const res = await request(app)
                .patch(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ note: 'Updated note' });

            expect(res.status).toBe(200);
            expect(res.body.data.wishlist.items[0].note).toBe('Updated note');
        });

        it('should not allow updating price', async () => {
            const res = await request(app)
                .patch(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ price: 89.99 });

            expect(res.status).toBe(200);
            expect(res.body.data.wishlist.items[0].price).not.toBe(89.99);
        });
    });

    describe('POST /api/wishlist/share', () => {
        beforeEach(async () => {
            // Add item to wishlist
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });
        });

        it('should generate shareable link', async () => {
            const res = await request(app)
                .post('/api/wishlist/share')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.linkId).toBeDefined();
            expect(mongoose.Types.ObjectId.isValid(res.body.data.linkId)).toBeTruthy();
        });
    });

    describe('GET /api/wishlist/:linkId', () => {
        let linkId;

        beforeEach(async () => {
            // Add item and generate shareable link
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });

            const shareRes = await request(app)
                .post('/api/wishlist/share')
                .set('Authorization', `Bearer ${token}`);

            linkId = shareRes.body.data.linkId;
        });

        it('should get wishlist by shareable link', async () => {
            const res = await request(app)
                .get(`/api/wishlist/${linkId}`);

            expect(res.status).toBe(200);
            expect(res.body.data.wishlist.items).toHaveLength(1);
        });

        it('should handle invalid link ID', async () => {
            const res = await request(app)
                .get(`/api/wishlist/${new mongoose.Types.ObjectId()}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Wishlist not found or link expired');
        });
    });

    describe('GET /api/wishlist/notifications', () => {
        beforeEach(async () => {
            // Add item to wishlist
            await request(app)
                .post('/api/wishlist')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id });

            // Update product price to trigger notification
            await Product.findByIdAndUpdate(product._id, { price: 79.99 });
        });

        it('should get wishlist notifications', async () => {
            const res = await request(app)
                .get('/api/wishlist/notifications')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.notifications).toHaveLength(1);
            expect(res.body.data.notifications[0].type).toBe('PRICE_DROP');
        });
    });

    describe('DELETE /api/wishlist/share/expired', () => {
        beforeEach(async () => {
            // Create expired links
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() - 31); // 31 days ago

            await Wishlist.create({
                userId: user._id,
                items: [],
                shareableLink: 'http://localhost:3000/api/wishlist/share/expired1',
                shareLinkId: 'expired1',
                shareLinkExpiry: expiredDate
            });
        });

        it('should clear expired links', async () => {
            const res = await request(app)
                .delete('/api/wishlist/share/expired')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.clearedCount).toBeGreaterThan(0);

            // Verify links are cleared
            const wishlist = await Wishlist.findOne({ userId: user._id });
            expect(wishlist.shareableLink).toBeNull();
            expect(wishlist.shareLinkId).toBeNull();
            expect(wishlist.shareLinkExpiry).toBeNull();
        });
    });
});