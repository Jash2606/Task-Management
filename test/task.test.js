const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let token;

beforeAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    const user = new User({
        name: 'Task Manager',
        email: 'taskmanager@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'user',
    });
    await user.save();

    token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
});

beforeEach(async () => {
    await Task.deleteMany({});

    const user = await User.findOne({ email: 'taskmanager@example.com' });

    await Task.create([
        { title: 'Task 1', description: 'Test task 1', status: 'pending', priority: 'low', dueDate: '2024-11-20', userId: user._id },
        { title: 'Task 2', description: 'Test task 2', status: 'completed', priority: 'high', dueDate: '2024-11-21', userId: user._id },
    ]);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Task Management Endpoints', () => {
    test('Create a new task', async () => {
        const response = await request(app)
            .post('/api/v1/task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                status: 'pending',
                priority: 'medium',
                dueDate: '2024-11-20',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('title', 'Test Task');
    });

    test('should retrieve tasks with status filter', async () => {
        const user = await User.findOne({ email: 'taskmanager@example.com' });
        await Task.create([
            { title: 'Task 1', description: 'This is a test task 1', status: 'pending', priority: 'low', dueDate: '2024-11-20', userId: user._id },
            { title: 'Task 2', description: 'This is a test task 2', status: 'completed', priority: 'high', dueDate: '2024-11-21', userId: user._id },
        ]);

        const response = await request(app)
            .get('/api/v1/task')
            .set('Authorization', `Bearer ${token}`)
            .query({ status: 'pending' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.tasks).toHaveLength(2);
        expect(response.body.tasks[0]).toHaveProperty('status', 'pending');
    });

    test('should retrieve tasks with priority filter', async () => {
        const response = await request(app)
            .get('/api/v1/task')
            .set('Authorization', `Bearer ${token}`)
            .query({ priority: 'high' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.tasks[0]).toHaveProperty('priority', 'high');
    });

    test('should retrieve tasks with dueDate filter', async () => {
        const response = await request(app)
            .get('/api/v1/task')
            .set('Authorization', `Bearer ${token}`)
            .query({ dueDate: '2024-11-20' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.tasks[0]).toHaveProperty('dueDate', '2024-11-20T00:00:00.000Z');
    });

    test('should retrieve tasks with pagination', async () => {
        const response = await request(app)
            .get('/api/v1/task')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.pagination).toHaveProperty('totalTasks');
        expect(response.body.pagination).toHaveProperty('currentPage', 1);
        expect(response.body.pagination).toHaveProperty('totalPages');
    });

    test('should retrieve tasks with sorting', async () => {
        const response = await request(app)
            .get('/api/v1/task/')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'priority', order: 'desc' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.tasks[0]).toHaveProperty('priority', 'high');
    });


    test('Update a task', async () => {
        const task = await Task.create({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'pending',
            priority: 'medium',
            dueDate: '2024-11-20',
            userId: (await User.findOne({ email: 'taskmanager@example.com' }))._id,
        });

        const response = await request(app)
            .put(`/api/v1/task/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'completed',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('status', 'completed');
    });


    test('Delete a task' , async () => {
        const user = await User.findOne({ email: 'taskmanager@example.com' });
        const task = new Task({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'pending',
            priority: 'medium',
            dueDate: '2024-11-20',
            userId: user._id,
        });
        await task.save();

        const response = await request(app)
            .delete(`/api/v1/task/${task._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Task deleted successfully !');
    });
});
