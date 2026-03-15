const request = require('supertest');

// Use a mock for mongoose to avoid needing a real DB in unit tests
jest.mock('../config/db', () => jest.fn());
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'localhost' } }),
  };
});

// Load app after mocks
const { app, server } = require('../server');

afterAll((done) => {
  server.close(done);
});

describe('Health check', () => {
  it('GET /api/health returns 200 with success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/FarmRent API/i);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth validation', () => {
  it('POST /api/auth/register returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/auth/login returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/auth/register returns 400 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'not-an-email',
      phone: '1234567890',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/register returns 400 for short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      phone: '1234567890',
      password: '123',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Auth middleware', () => {
  it('GET /api/auth/me returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/notifications returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/notifications');
    expect(res.statusCode).toBe(401);
  });
});

describe('Equipment routes (public)', () => {
  it('GET /api/equipment returns 200', async () => {
    // Mock Equipment.find chain
    const Equipment = require('../models/Equipment');
    Equipment.countDocuments = jest.fn().mockResolvedValue(0);
    Equipment.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).get('/api/equipment');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.equipment)).toBe(true);
  });
});
