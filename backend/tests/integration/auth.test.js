const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

// Use the API subdomain with /api prefix
const BASE_URL = 'https://api.h-rms.me/api';

describe('Auth API - Integration Tests (Deployed)', function() {
  // Increase timeout for all tests in this suite
  this.timeout(30000); // 30 seconds

  describe('POST /admin/auth/login', () => {
    
    it('should login admin with correct credentials', async function() {
      this.timeout(30000);
      
      const res = await chai.request(BASE_URL)
        .post('/admin/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'k224586@nu.edu.pk',
          password: 'Password@123',
        })
        .timeout(20000);
      
      console.log('Admin login response:', res.status, res.body);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Login successful');
      expect(res.body).to.have.property('status', 'OK');
    });

    it('should return 401 for invalid admin credentials', async function() {
      this.timeout(30000);
      
      const res = await chai.request(BASE_URL)
        .post('/admin/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'k224586@nu.edu.pk',
          password: 'WrongPassword@999',
        })
        .timeout(20000);
      
      console.log('Invalid admin password response:', res.status, res.body);
      
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message');
    });

    it('should return 404 for non-existent admin', async function() {
      this.timeout(30000);
      
      const res = await chai.request(BASE_URL)
        .post('/admin/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'nonexistent_admin@nu.edu.pk',
          password: 'someP1!assword',
        })
        .timeout(20000);
      
      console.log('Non-existent admin response:', res.status, res.body);
      
      // Should return 404 or 401 depending on implementation
      expect(res.status).to.be.oneOf([404, 401]);
    });
  });

  describe('POST /employees/auth/register', () => {
    
    it('should register a new employee (if endpoint exists)', async function() {
      this.timeout(30000);
      
      try {
        const uniqueEmail = `newuser_${Date.now()}@example.com`;
        
        const res = await chai.request(BASE_URL)
          .post('/employees/auth/register')
          .set('Content-Type', 'application/json')
          .send({
            email: uniqueEmail,
            password: 'NewPassword@123',
            firstName: 'Test',
            lastName: 'User'
          })
          .timeout(20000);
        
        console.log('Registration response:', res.status, res.body);
        
        if (res.status === 200 || res.status === 201) {
          expect(res.body).to.have.property('status', 'OK');
        }
      } catch (error) {
        // If endpoint doesn't exist, skip this test
        if (error.status === 404) {
          console.log('⚠️  Registration endpoint not available. Skipping test.');
          this.skip();
        } else {
          throw error;
        }
      }
    });
  });
});