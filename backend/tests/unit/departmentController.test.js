const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const httpStatus = require('../../utils/httpStatus');

describe('Department Controller - Unit Tests', () => {
  let sandbox;
  let req;
  let res;
  let departmentController;
  let DepartmentModelStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      body: {},
      params: {},
      query: {}
    };

    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis(),
      send: sandbox.stub().returnsThis()
    };

    // Create stubs for Department model methods
    DepartmentModelStub = {
      getDepartments: sandbox.stub(),
      getallDepartmentDetails: sandbox.stub(),
      createNewDepartment: sandbox.stub(),
      removeDepartment: sandbox.stub()
    };

    // Load controller with mocked dependencies
    departmentController = proxyquire('../../controllers/department', {
      '../models/department': DepartmentModelStub
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDepartment', () => {
    it('should return list of departments successfully', async () => {
      const fakeDepartments = [
        { id: 1, name: 'HR' },
        { id: 2, name: 'IT' }
      ];
      
      DepartmentModelStub.getDepartments.resolves(fakeDepartments);

      await departmentController.getDepartment(req, res);

      // Verify model method was called
      expect(DepartmentModelStub.getDepartments.calledOnce).to.be.true;

      // Verify status was called with 200
      expect(res.status.calledWith(httpStatus.OK.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      // Verify the response structure
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('status');
      expect(response).to.have.property('data');
      expect(response.data).to.deep.equal(fakeDepartments);
    });

    it('should handle errors when fetching departments', async () => {
      const error = new Error('Database connection failed');
      
      DepartmentModelStub.getDepartments.rejects(error);

      await departmentController.getDepartment(req, res);

      // Verify error response with 500
      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('error');
      expect(response.message).to.equal('Error fetching data');
    });
  });

  describe('getDepartmentsDetails', () => {
    it('should return department details successfully', async () => {
      const fakeDepartmentDetails = [
        { id: 1, name: 'HR', employeeCount: 10 },
        { id: 2, name: 'IT', employeeCount: 15 }
      ];
      
      DepartmentModelStub.getallDepartmentDetails.resolves(fakeDepartmentDetails);

      await departmentController.getDepartmentsDetails(req, res);

      // Verify model method was called
      expect(DepartmentModelStub.getallDepartmentDetails.calledOnce).to.be.true;

      // Verify response
      expect(res.status.calledWith(httpStatus.OK.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('data');
      expect(response.data).to.deep.equal(fakeDepartmentDetails);
    });
  });

  describe('createDepartment', () => {
    it('should create a new department successfully', async () => {
      req.body = { name: 'Finance' };
      
      DepartmentModelStub.createNewDepartment.resolves();

      await departmentController.createDepartment(req, res);

      // Verify the model method was called correctly
      expect(DepartmentModelStub.createNewDepartment.calledOnce).to.be.true;
      expect(DepartmentModelStub.createNewDepartment.calledWith('Finance')).to.be.true;

      // Verify response - controller uses httpStatus.OK (200), not CREATED (201)
      expect(res.status.calledWith(httpStatus.OK.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('status');
      expect(response.message).to.equal('Created Successfully');
    });

    it('should handle errors when name is undefined', async () => {
      req.body = {}; // Missing name - will pass undefined to model
      
      // Model will be called with undefined, which might cause an error
      const error = new Error('Department name is required');
      DepartmentModelStub.createNewDepartment.rejects(error);

      await departmentController.createDepartment(req, res);

      // Verify the model was still called (controller doesn't validate)
      expect(DepartmentModelStub.createNewDepartment.calledOnce).to.be.true;
      expect(DepartmentModelStub.createNewDepartment.calledWith(undefined)).to.be.true;

      // Verify error response - controller returns 500 for all errors
      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('error');
      expect(response.message).to.equal('Error fetching data');
    });

    it('should handle duplicate department error', async () => {
      req.body = { name: 'HR' };
      
      const error = new Error('Department already exists');
      DepartmentModelStub.createNewDepartment.rejects(error);

      await departmentController.createDepartment(req, res);

      // Verify error handling - returns 500 for all errors
      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('error');
      expect(response.message).to.equal('Error fetching data');
    });
  });

  describe('deleteDepartment', () => {
    it('should delete a department successfully', async () => {
      req.body = { name: 'Finance' };
      
      DepartmentModelStub.removeDepartment.resolves();

      await departmentController.deleteDepartment(req, res);

      // Verify the model method was called correctly
      expect(DepartmentModelStub.removeDepartment.calledOnce).to.be.true;
      expect(DepartmentModelStub.removeDepartment.calledWith('Finance')).to.be.true;

      // Verify response
      expect(res.status.calledWith(httpStatus.OK.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('status');
      expect(response.message).to.equal('Deleted successfully');
    });

    it('should handle errors when name is undefined', async () => {
      req.body = {}; // Missing name - will pass undefined to model
      
      // Model will be called with undefined
      const error = new Error('Department name is required');
      DepartmentModelStub.removeDepartment.rejects(error);

      await departmentController.deleteDepartment(req, res);

      // Verify the model was still called (controller doesn't validate)
      expect(DepartmentModelStub.removeDepartment.calledOnce).to.be.true;
      expect(DepartmentModelStub.removeDepartment.calledWith(undefined)).to.be.true;

      // Verify error response - controller returns 500 for all errors
      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('error');
      expect(response.message).to.equal('Error fetching data');
    });

    it('should handle department not found error', async () => {
      req.body = { name: 'NonExistent' };
      
      const error = new Error('Department not found');
      DepartmentModelStub.removeDepartment.rejects(error);

      await departmentController.deleteDepartment(req, res);

      // Verify error handling - returns 500 for all errors
      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR.code)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property('error');
      expect(response.message).to.equal('Error fetching data');
    });
  });
});