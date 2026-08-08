const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

let testUser;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({ email: /test-otp-report/ });
  testUser = await User.create({
    name: 'OTP Test User',
    email: 'test-otp-report@example.com',
    password: await require('bcrypt').hash('TestPass123!', 10)
  });
});

afterAll(async () => {
  await User.deleteMany({ email: /test-otp-report/ });
  await mongoose.connection.close();
});

describe('OTP and Report Backend Flow', () => {
  test('Login returns otpRequired on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'TestPass123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.otpRequired).toBe(true);
  });

  test('Verify OTP fails with invalid code', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: testUser.email, otp: '000000' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Report submission requires authentication', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        reportedUserId: testUser._id,
        reason: 'Harassment',
        description: 'This is a malicious user.'
      });

    expect(res.statusCode).toBe(401);
  });
});
