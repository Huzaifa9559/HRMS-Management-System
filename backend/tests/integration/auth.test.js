const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const http = require('http');

// Start server for testing if not already started
if (!app.listening) {
  const server = http.createServer(app);
  server.listen(8001, () => {
    console.log('Test server started on port 8001');
  });
}

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API - Integration Tests', () => {
  describe('POST /api/employees/auth/login', () => {
    it('should return 404 for non-existent user', (done) => {
      chai
        .request(app)
        .post('/api/employees/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 401 for invalid password', (done) => {
      chai
        .request(app)
        .post('/api/employees/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('POST /api/admin/auth/login', () => {
    it('should login admin with correct credentials', (done) => {
      chai
        .request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'k224586@nu.edu.pk',
          password: 'Password@123',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Login successful');
          done();
        });
    });

    it('should return 401 for invalid admin credentials', (done) => {
      chai
        .request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'k224586@nu.edu.pk',
          password: 'wrongpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
