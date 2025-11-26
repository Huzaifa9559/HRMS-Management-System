import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { useParams } from 'react-router-dom';
import SideMenu from './SideMenu';
import { FaUpload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
const Account = () => {
  const [profileImage, setProfileImage] = useState(
    'https://tse3.mm.bing.net/th?id=OIP.zSBNiaIRxqsRKRy5WWTDpAHaHa&pid=Api&P=0&h=220'
  );
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const { employeeId } = useParams();
  
const [employeeDetails, setEmployeeDetails] = useState({
  employee_first_name: '',
  employee_last_name: '',
  employeeID: '',
  employee_DOB: '',
  employee_phonenumber: '',
  department_name: '',
  designation_name: '',
  street_address: '',
  employee_status: 1,
  state: '',
  city: '',
  country: '',
  zip_code: '',
  employee_email: '', // Added field
  password: '', // Added field,
  employee_image:''
});

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [file, setFile] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee details
        const employeeRes = await axios.get(`/api/admin/employee/${employeeId}`); // Replace with correct API endpoint
        setEmployeeDetails(employeeRes.data.data);

        // Fetch departments
        const departmentsRes = await axios.get('/api/admin/department'); // Replace with correct API endpoint
        setDepartments(departmentsRes.data.data);

        // Fetch designations
        const designationsRes = await axios.get('/api/admin/designation'); // Replace with correct API endpoint
        setDesignations(designationsRes.data.data);

        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
        const imageURL = employeeRes.data.data.employee_image ? `${backendURL}/uploads/employees/${employeeRes.data.data.employee_image}` : null;
        setProfileImage(imageURL);

      } catch (error) {
        toast.error('Failed to fetch data from the server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmployeeDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle profile picture update
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setFile(event.target.files[0]);
        toast.success('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Failed to update profile picture.');
    }
  };

  // Handle file uploads (ID Card, Address Proof)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast.success(`Uploaded file: ${file.name}`);
    } else {
      toast.error('Failed to upload file.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/admin/employee/edit`, {
    employeeId:employeeId,
    updatedData: employeeDetails,
    file: file
}, {headers: { 'Content-Type': 'multipart/form-data' }}); 
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3">
        <Header title="Account" />
        <div className="container-fluid mt-2">
          <h4 className="mb-3">Profile</h4>
          <div className="row">
            <div className="col-md-3 d-flex flex-column justify-content-between">
  <div className="card h-100">
    <div className="card-body text-center">
      <div
        onClick={() => setShowOptions(!showOptions)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <img
          src={profileImage}
          alt="Profile"
          className="rounded-circle mb-2"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
      </div>

      {showOptions && (
        <div
          style={{
            position: 'absolute',
            top: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          <button
            className="btn btn-link text-dark d-block"
            style={{ textDecoration: 'none' }}
            onClick={() => {
              setShowModal(true);
              setShowOptions(false);
            }}
          >
            View
          </button>
          <label
            className="btn btn-link text-dark d-block"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Edit
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfileImageChange}
            />
          </label>
        </div>
      )}

      <h6 className="card-title">{employeeDetails.name}</h6>
      <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
        {employeeDetails.designation}
      </p>

    
   <div className="mt-3">
  {/* Email Field */}
  <label htmlFor="employee_email" className="form-label">Email</label>
<input
  type="email"
  className="form-control"
  id="employee_email"
  value={employeeDetails.employee_email}
  onChange={handleChange}
  pattern="[a-zA-Z0-9._%+-]+@nu\.nu\.pk" 
                      title="Please enter an email in the format: username@nu.edu.pk"
                      required
/>
</div>

<div className="mt-3">
  {/* Employee ID Field */}
  <label htmlFor="employeeID" className="form-label">Employee ID</label>
  <input
    type="text"
    className="form-control"
    id="employeeID"
    value={employeeDetails.employeeID}
    readOnly
  />
</div>


      <label
        htmlFor="addressProofUpload"
        className="mt-3 p-2 border border-2 border-dashed rounded d-block"
      >
        <FaUpload className="text-muted mb-1" size={18} />
        <p className="mb-0" style={{ fontSize: '0.8rem' }}>Address Proof</p>
        <input
          type="file"
          id="addressProofUpload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </label>
    </div>
  </div>
</div>

        <div className="col-md-9">
  <div className="card" style={{ height: '100%' }}>
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        {/* Row for First Name and Last Name */}
        <div className="row mb-3">
          {/* First Name Field */}
          <div className="col-md-6">
            <label htmlFor="employee_first_name" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="employee_first_name"
              value={employeeDetails.employee_first_name}
              onChange={handleChange}
            />
          </div>

          {/* Last Name Field */}
          <div className="col-md-6">
            <label htmlFor="employee_last_name" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="employee_last_name"
              value={employeeDetails.employee_last_name}
              onChange={handleChange}
            />
          </div>
        </div>

                    <div className="row mb-1">
                      <div className="col-md-6">
                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          id="employee_DOB"
                          value={employeeDetails.employee_DOB}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="employee_phonenumber"
                          value={employeeDetails.employee_phonenumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-1">
                      <div className="col-md-6">
                        <label htmlFor="department" className="form-label">Department</label>
                        <select
                          className="form-select"
                          id="department_name"
                          value={employeeDetails.department_name}
                          onChange={handleChange}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.departmentID} value={dept.department_name}>
                              {dept.department_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="designation" className="form-label">Designation</label>
                        <select
                          className="form-select"
                          id="designation_name"
                          value={employeeDetails.designation_name}
                          onChange={handleChange}
                        >
                          <option value="">Select Designation</option>
                          {designations.map((desig) => (
                            <option key={desig.designationID} value={desig.designation_name}>
                              {desig.designation_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-1">
                      <div className="col-md-6">
                        <label htmlFor="address1" className="form-label">Street Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="street_address"
                          value={employeeDetails.street_address}
                          onChange={handleChange}
                        />
                      </div>
                  
                      <div className="col-md-6">
  <label htmlFor="status" className="form-label">Status</label>
  <select
    className="form-select"
    id="employee_status"
    value={employeeDetails.employee_status}
    onChange={(e) =>
      setEmployeeDetails((prev) => ({
        ...prev,
        employee_status: parseInt(e.target.value, 10),
      }))
    }
  >
    <option value={1}>Active</option>
    <option value={0}>Disabled</option>
  </select>
</div>
                

                    </div>

                    <div className="row mb-1">
                      <div className="col-md-6">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          value={employeeDetails.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          value={employeeDetails.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-1">
                      <div className="col-md-6">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          value={employeeDetails.country}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="zipCode" className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip_code"
                          value={employeeDetails.zip_code}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="text-end mt-3">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <img
            src={profileImage}
            alt="Profile Fullscreen"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#fff',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Account;
