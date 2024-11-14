const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


beforeEach(async () => {
    await User.deleteMany({});
});


afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication Endpoints', () => {

    test('Register a new user', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'User registered successfully.');
    });

    test('Login an existing user', async () => {
        // First, register a user to ensure they exist
        await new User({
            name: 'Test User',
            email: 'testuser@example.com',
            password: await bcrypt.hash('Password123!', 10),
        }).save();

        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'testuser@example.com',
            password: 'Password123!',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('token');
    });

    test('Reject login with incorrect password', async () => {

        await new User({
            name: 'Test User',
            email: 'testuser@example.com',
            password: await bcrypt.hash('Password123!', 10),
        }).save();

        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'testuser@example.com',
            password: 'WrongPassword!',
        });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Password is incorrect.');
    });
});
