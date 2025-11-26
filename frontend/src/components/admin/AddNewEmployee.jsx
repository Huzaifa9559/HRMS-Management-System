import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import SideMenu from './SideMenu';
import PhoneInput from 'react-phone-input-2';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-phone-input-2/lib/style.css';
const phoneUtil = PhoneNumberUtil.getInstance();
const Account = () => {
        employeeName: '',
        countryCode: '+',
        phoneNumber: '',
        address: '',
        designation_name: '',
        department_name: '',
        agreeTerms: false
    });
  const [profileImage, setProfileImage] = useState(
    'https://tse3.mm.bing.net/th?id=OIP.zSBNiaIRxqsRKRy5WWTDpAHaHa&pid=Api&P=0&h=220'
  );
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

    const [isValidPhone, setIsValidPhone] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState({
    email: '',
    password: '',
    dob: '',
    phone: '',
    department_name: '',
    designation_name: '',
    street_address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    status: 1,
    file: null,
    phoneNumber: '',
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [file, setFile] = useState(null);
  
  // Generate a random default password
  const generatePassword = () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()';
  
  const allChars = upperCase + lowerCase + numbers + specialChars;
  
  const getRandomChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));
  
  // Ensure at least one of each required character type
  let password = [
    getRandomChar(upperCase),
    getRandomChar(lowerCase),
    getRandomChar(numbers),
    getRandomChar(specialChars),
  ];
  
  // Fill the rest of the password with random characters
  for (let i = 4; i < 12; i++) { // Set password length to 12
    password.push(getRandomChar(allChars));
  }
  
  // Shuffle the password to randomize character order
  password = password.sort(() => Math.random() - 0.5).join('');
  
  return password;
};
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then((response) => {
                const countries = response.data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2.toLowerCase(), // Use cca2 code for country (ISO 3166-1 alpha-2)
                    flag: country.flags.png || country.flags.svg, // Fetch flag in png or svg
                    dialCode: country.idd.root ? `${country.idd.root}${country.idd.suffixes[0]}` : '', // Combine root and suffix
                }));
            })
            .catch((error) => {
                // Error fetching country data
            });
    }, []);
  // Phone number validation
    const validatePhoneNumber = (phoneNumber, countryCode) => {
        try {
            const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode.toUpperCase());
            const isValid = phoneUtil.isValidNumber(parsedNumber);
            setIsValidPhone(isValid);
        } catch (error) {
            setIsValidPhone(false);
        }
    };
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const departmentsRes = await axios.get('/api/admin/department');
        setDepartments(departmentsRes.data.data);

        const designationsRes = await axios.get('/api/admin/designation');
        setDesignations(designationsRes.data.data);
      } catch (error) {
        toast.error('Failed to fetch dropdown data');
      }
    };

    // Set default password during component initialization
    setEmployeeDetails((prev) => ({
      ...prev,
      password: generatePassword(),
    }));

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmployeeDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setFile(event.target.files[0]);
        toast.success('Profile picture uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast.success(`Uploaded file: ${file.name}`);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();


  // Check required fields
  const requiredFields = [
    'employee_first_name',
    'employee_last_name',
    'email',
    'password',
    'dob',
    'phoneNumber',
    'department_name',
    'designation_name',
    'street_address',
    'city',
    'state',
    'country',
    'zipCode',
  ];

  const emptyFields = requiredFields.filter((field) => !employeeDetails[field]);

  // If there are empty fields, show error toast
  if (emptyFields.length > 0) {
    toast.error(`Please fill out the following fields: ${emptyFields.join(', ')}`);
    return;
  }

  // Check email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@nu\.edu\.pk$/;
  if (!emailPattern.test(employeeDetails.email)) {
    toast.error('Please enter a valid email address (e.g., username@nu.edu.pk)');
    return;
  }

  // Check phone number validation
  if (!isValidPhone) {
    toast.error('Please enter a valid phone number');
    return;
  }

  // Submit form if all validations pass
  try {
    employeeDetails.file = file;
    await axios.post('/api/admin/employee/create', employeeDetails,
      { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('New employee added successfully.');
    // Clear all fields after successful submission
    setEmployeeDetails({
       email: '',
    password: '',
    dob: '',
    phone: '',
    department_name: '',
    designation_name: '',
    street_address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    status: 1,
    file: null,
    phoneNumber: '',// or '' if you're using a file input
    });
    
  } catch (error) {
    toast.error('Failed to add new employee.');
  }
};


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
            <div className="col-md-3">
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
                        onClick={() => {
                          setShowModal(true);
                          setShowOptions(false);
                        }}
                      >
                        View
                      </button>
                      <label className="btn btn-link text-dark d-block">
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

                  {/* Email */}
                  <div className="mb-3 text-start">
                    <label htmlFor="email" className="form-label">Email</label>
                   <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={employeeDetails.email}
                      onChange={handleChange}
                      required
                    />

      
                  </div>

                  {/* Password */}
                  <div className="mb-3 text-start">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        value={employeeDetails.password}
                        onChange={handleChange}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <label
                    htmlFor="idCardUpload"
                    className="mt-3 p-2 border border-2 border-dashed rounded d-block"
                  >
                    <FaUpload className="text-muted mb-1" size={18} />
                    <p className="mb-0" style={{ fontSize: '0.8rem' }}>ID Card</p>
                    <input
                      type="file"
                      id="idCardUpload"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </label>

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
                    
                            

                  
                  

                    {/* Other Fields */}
                   <div className="row mb-2">
  <div className="col-md-6">
    <label htmlFor="dob" className="form-label">Date of Birth</label>
    <input
      type="date"
      className="form-control"
      id="dob"
      value={employeeDetails.dob}
      onChange={handleChange}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
    <PhoneInput
      country={'us'} // Default country
      value={employeeDetails.phoneNumber}
      onChange={(phoneNumber, country) => {
        validatePhoneNumber(phoneNumber, country.countryCode); // Validate with country code
        employeeDetails.phoneNumber=phoneNumber; //
      }}
      inputClass="form-control form-control-sm"
      id="phoneNumber"
      disableDropdown={false} // Allow the dropdown for country selection
      enableSearch={true} // Allow search in the country dropdown
      disableCountryCode={false} // Make sure the country code is editable
      specialLabel="Phone Number" // Label for phone input
      limitMaxLength={true} // Enforce the length limit based on the country format
    />
    {!isValidPhone && <div className="text-danger">Invalid phone number</div>}
  </div>
</div>


                    {/* Dropdowns */}
                    <div className="row mb-2">
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
                            <option key={dept.id} value={dept.department_name}>
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
                            <option key={desig.id} value={desig.designation_name}>
                              {desig.designation_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <label htmlFor="street_address" className="form-label">Street Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="street_address"
                          value={employeeDetails.street_address}
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

                    <div className="row mb-2">
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
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          value={employeeDetails.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-md-6">
                        <label htmlFor="zipCode" className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zipCode"
                          value={employeeDetails.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select
                          className="form-select"
                          id="status"
                          value={employeeDetails.status}
                          onChange={handleChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>



                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Create
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
