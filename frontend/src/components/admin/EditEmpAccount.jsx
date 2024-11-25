import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import { FaUpload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';

const Account = () => {
  const [profileImage, setProfileImage] = useState(
    'https://foxrothschild.gjassets.com/content/uploads/2023/11/Andrews_Kaiya_Bio-default-headshot-photo-110621.jpg'
  );
  const [showModal, setShowModal] = useState(false); // State for profile picture modal
  const [showOptions, setShowOptions] = useState(false); // State for view/edit options
  
  const [loading, setLoading] = useState(true); // Loading state
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);



  // Handler for changing the profile picture
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result); // Set the new image preview
        toast.success('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Failed to update profile picture.');
    }
  };

  // Handler for file uploads (ID Card, Address Proof)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast.success(`Uploaded file: ${file.name}`);
    } else {
      toast.error('Failed to upload file.');
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
            {/* Profile Image and Upload Sections */}
            <div className="col-md-3 d-flex flex-column justify-content-between">
              <div className="card h-100">
                <div className="card-body text-center">
                  {/* Profile Picture */}
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
                        style={{ textDecoration: 'none' }} // Remove underline
                        onClick={() => {
                            setShowModal(true);
                            setShowOptions(false);
                        }}
                        >
                        View
                        </button>
                        <label
                        className="btn btn-link text-dark d-block"
                        style={{ textDecoration: 'none', cursor: 'pointer' }} // Remove underline
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


                  <h6 className="card-title">Kaiya Schleifer</h6>
                  <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                    UX/UI Designer
                  </p>

                  {/* ID Card Upload */}
                  <label htmlFor="idCardUpload" className="mt-3 p-2 border border-2 border-dashed rounded d-block">
                    <FaUpload className="text-muted mb-1" size={18} />
                    <p className="mb-0" style={{ fontSize: '0.8rem' }}>ID Card</p>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Browse to upload</small>
                    <input
                      type="file"
                      id="idCardUpload"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Address Proof Upload */}
                  <label htmlFor="addressProofUpload" className="mt-3 p-2 border border-2 border-dashed rounded d-block">
                    <FaUpload className="text-muted mb-1" size={18} />
                    <p className="mb-0" style={{ fontSize: '0.8rem' }}>Address Proof</p>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Browse to upload</small>
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

            {/* Form Fields */}
            <div className="col-md-9">
            <div className="card" style={{ height: '100%' }}>
                <div className="card-body">
                    <form>
                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="employeeId" className="form-label">Employee ID</label>
                        <input type="text" className="form-control" id="employeeId" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" id="dob" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" id="phone" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="department" className="form-label">Department</label>
                        <input type="text" className="form-control" id="department" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="designation" className="form-label">Designation</label>
                        <input type="text" className="form-control" id="designation" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="address1" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address1" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="address2" className="form-label">Address 2</label>
                        <input type="text" className="form-control" id="address2" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="state" className="form-label">State</label>
                        <input type="text" className="form-control" id="state" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" className="form-control" id="city" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input type="text" className="form-control" id="country" />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="zipCode" className="form-label">Zip Code</label>
                        <input type="text" className="form-control" id="zipCode" />
                        </div>
                    </div>

                    <div className="text-end mt-2">
                        <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => toast.success('Profile updated successfully!')}
                        >
                        Update
                        </button>
                    </div>
                    </form>
                </div>
                </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing profile picture */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
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

      {/* Toaster notifications */}
      <ToastContainer />
    </div>
  );
};

export default Account;
