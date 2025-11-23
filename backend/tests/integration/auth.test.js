const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const http = require('http');
const { sequelize } = require('../../config/sequelizeConfig');
const bcrypt = require('bcrypt');

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
  // Setup test data before tests
  before(async function () {
    this.timeout(10000); // Increase timeout for setup

    try {
      // Check if test employee already exists
      const existing = await sequelize.query(
        "SELECT employeeID FROM Employee WHERE employee_email = 'test@example.com'",
        { type: sequelize.QueryTypes.SELECT }
      );

      if (existing.length === 0) {
        // Create a test department if it doesn't exist
        const dept = await sequelize.query(
          "SELECT departmentID FROM Department WHERE department_name = 'Test Department'",
          { type: sequelize.QueryTypes.SELECT }
        );
        let departmentID = dept[0]?.departmentID;

        if (!departmentID) {
          await sequelize.query(
            "INSERT INTO Department (department_name) VALUES ('Test Department')",
            { type: sequelize.QueryTypes.INSERT }
          );
          // Get the inserted ID
          const insertedDept = await sequelize.query(
            "SELECT departmentID FROM Department WHERE department_name = 'Test Department'",
            { type: sequelize.QueryTypes.SELECT }
          );
          departmentID = insertedDept[0].departmentID;
        }

        // Create a test designation if it doesn't exist
        const des = await sequelize.query(
          "SELECT designationID FROM Designation WHERE designation_name = 'Test Designation'",
          { type: sequelize.QueryTypes.SELECT }
        );
        let designationID = des[0]?.designationID;

        if (!designationID) {
          await sequelize.query(
            "INSERT INTO Designation (designation_name) VALUES ('Test Designation')",
            { type: sequelize.QueryTypes.INSERT }
          );
          const insertedDes = await sequelize.query(
            "SELECT designationID FROM Designation WHERE designation_name = 'Test Designation'",
            { type: sequelize.QueryTypes.SELECT }
          );
          designationID = insertedDes[0].designationID;
        }

        // Create a test address
        await sequelize.query(
          "INSERT INTO Address (street_address, city, state, country, zip_code) VALUES ('123 Test St', 'Test City', 'Test State', 'Test Country', '12345')",
          { type: sequelize.QueryTypes.INSERT }
        );
        const insertedAddr = await sequelize.query(
          "SELECT address_ID FROM Address WHERE street_address = '123 Test St' ORDER BY address_ID DESC LIMIT 1",
          { type: sequelize.QueryTypes.SELECT }
        );
        const addressID = insertedAddr[0].address_ID;

        // Create test employee with hashed password
        const hashedPassword = await bcrypt.hash('testpassword123', 10);
        await sequelize.query(
          `INSERT INTO Employee (
            employee_first_name, employee_last_name, employee_email, 
            employee_password, employee_phonenumber, employee_status, employee_joining_date,
            departmentID, designationID, address_ID, employee_DOB
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            replacements: [
              'Test',
              'User',
              'test@example.com',
              hashedPassword,
              '1234567890', // Phone number (required field)
              1, // Active
              new Date(),
              departmentID,
              designationID,
              addressID,
              '1990-01-01',
            ],
            type: sequelize.QueryTypes.INSERT,
          }
        );

        console.log('✅ Test employee created: test@example.com');
      } else {
        console.log('ℹ️  Test employee already exists: test@example.com');
      }
    } catch (error) {
      console.error('Error setting up test data:', error);
      // Don't fail the tests if setup fails - might be due to existing data
    }
  });

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
