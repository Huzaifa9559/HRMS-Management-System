const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

// Use the API subdomain with /api prefix
const BASE_URL = 'https://api.h-rms.me/api';

describe('Department API - Integration Tests (Deployed)', function() {
  // Increase timeout for all tests in this suite
  this.timeout(30000); // 30 seconds

  describe('GET /admin/department/', () => {
    it('should get all departments', async function() {
      this.timeout(30000);
      
      const res = await chai.request(BASE_URL)
        .get('/admin/department/')
        .set('Accept', 'application/json')
        .timeout(20000); // Request timeout
      
      console.log('GET /admin/department/ response:', res.body);
      console.log('Status:', res.status);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status', 'OK');
      expect(res.body).to.have.property('data').that.is.an('array');
    });

    it('should handle errors gracefully', async function() {
      this.timeout(30000);
      
      // Test with invalid endpoint to verify error handling
      try {
        const res = await chai.request(BASE_URL)
          .get('/admin/department/invalid')
          .set('Accept', 'application/json')
          .timeout(20000);
        
        // If it doesn't throw, check for error status
        expect(res.status).to.be.at.least(400);
      } catch (error) {
        // Expected to fail with 404 or similar
        expect(error.status).to.be.at.least(400);
      }
    });
  });

  describe('POST /admin/department/create', () => {
    it('should create a new department', async function() {
      this.timeout(30000);
      
      // Use timestamp to ensure unique department name
      const uniqueName = `TestDept_${Date.now()}`;
      
      const res = await chai.request(BASE_URL)
        .post('/admin/department/create')
        .set('Content-Type', 'application/json')
        .send({ name: uniqueName })
        .timeout(20000);
      
      console.log('POST /admin/department/create response:', res.body);
      console.log('Status:', res.status);
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status', 'OK');
      expect(res.body).to.have.property('message', 'Created Successfully');
    });

    it('should return error when creating duplicate department', async function() {
      this.timeout(30000);
      
      const dupeName = `DuplicateTest_${Date.now()}`;
      
      // Create first time - should succeed
      await chai.request(BASE_URL)
        .post('/admin/department/create')
        .set('Content-Type', 'application/json')
        .send({ name: dupeName })
        .timeout(20000);
      
      // Create second time - should fail
      const res = await chai.request(BASE_URL)
        .post('/admin/department/create')
        .set('Content-Type', 'application/json')
        .send({ name: dupeName })
        .timeout(20000);
      
      console.log('Duplicate creation response:', res.body);
      
      // Should return 500 with error (based on your controller)
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /admin/department/delete', () => {
    it('should delete an existing department', async function() {
      this.timeout(30000);
      
      // First create a department to delete
      const deptName = `ToDelete_${Date.now()}`;
      
      const createRes = await chai.request(BASE_URL)
        .post('/admin/department/create')
        .set('Content-Type', 'application/json')
        .send({ name: deptName })
        .timeout(20000);
      
      expect(createRes).to.have.status(200);
      console.log('Created department for deletion:', deptName);
      
      // Now delete it
      const deleteRes = await chai.request(BASE_URL)
        .delete('/admin/department/delete')
        .set('Content-Type', 'application/json')
        .send({ name: deptName })
        .timeout(20000);
      
      console.log('DELETE /admin/department/delete response:', deleteRes.body);
      console.log('Status:', deleteRes.status);
      
      expect(deleteRes).to.have.status(200);
      expect(deleteRes.body).to.have.property('status', 'OK');
      expect(deleteRes.body).to.have.property('message', 'Deleted successfully');
    });

    it('should return error when deleting non-existent department', async function() {
      this.timeout(30000);
      
      const res = await chai.request(BASE_URL)
        .delete('/admin/department/delete')
        .set('Content-Type', 'application/json')
        .send({ name: 'NonExistentDepartment_12345' })
        .timeout(20000);
      
      console.log('Delete non-existent response:', res.body);
      
      // Should return 500 with error (based on your controller)
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });
});