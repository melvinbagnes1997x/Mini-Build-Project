const request = require('supertest');
const app = require('../app');

describe('GET /api/tasks', () => {
  it('should require authentication', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });
}); 