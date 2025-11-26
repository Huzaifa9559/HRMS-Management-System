import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, OverlayTrigger, Popover } from 'react-bootstrap';
import { PersonCircle, Key, BoxArrowRight } from 'react-bootstrap-icons';
import axios from 'axios';

export default function Header({ title }) {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState();
    const [profileData, setProfileData] = useState([]);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/employees/employee/image`, {
          headers: {
            Authorization: `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
          }
        });
          setEmployeeData(response.data.data);
          
          const response2 = await axios.get(`/api/employees/employee`, {
          headers: {
            Authorization: `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
              }
              
          });
          setProfileData(response2.data.data);
      } catch (error) {
        
        //navigate('/login');
      }
    };

    fetchEmployeeData();
  }, []);

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const imageURL = employeeData ? `${backendURL}/uploads/employees/${employeeData}` : null;

    const profileDetails = {
        name: profileData.name,
        title: profileData.designation_name,
        imageUrl: imageURL,
    };

    const handleProfileClick = () => {
        navigate('/employee/account');
    };

    const handleChangePasswordClick = () => {
        navigate('/set-new-password');
    };

    const handleLogoutClick = () => {
        // Clear cache and cookies
        localStorage.clear(); // Clear local storage
        sessionStorage.clear(); // Clear session storage
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        }); // Clear cookies

        navigate('/login');
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    const popover = (
        <Popover id="popover-profile" style={{ minWidth: '200px', marginLeft: '10px' }}>
            <Popover.Body>
                <div className="d-flex align-items-center">
                    <Image
                        src={profileDetails.imageUrl}
                        roundedCircle
                        style={{
                            width: '50px',
                            height: '50px',
                            marginRight: '10px'
                        }}
                        alt="Profile"
                    />
                    <div>
                        <strong>{profileDetails.name}</strong>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{profileDetails.title}</p>
                    </div>
                </div>
                <hr />
                <button
                    type="button"
                    onClick={handleProfileClick}
                    className="d-flex align-items-center mb-2 border-0 bg-transparent w-100 text-start"
                    style={{
                        color: 'black',
                        cursor: 'pointer',
                        backgroundColor: hoveredItem === 'profile' ? '#f0f0f0' : 'transparent',
                        padding: '5px',
                        borderRadius: '4px'
                    }}
                    onMouseEnter={() => setHoveredItem('profile')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <PersonCircle className="me-2" /> Profile
                </button>
                <button
                    type="button"
                    onClick={handleChangePasswordClick}
                    className="d-flex align-items-center mb-2 border-0 bg-transparent w-100 text-start"
                    style={{
                        color: 'black',
                        cursor: 'pointer',
                        backgroundColor: hoveredItem === 'change-password' ? '#f0f0f0' : 'transparent',
                        padding: '5px',
                        borderRadius: '4px'
                    }}
                    onMouseEnter={() => setHoveredItem('change-password')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Key className="me-2" /> Change Password
                </button>
                <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="d-flex align-items-center border-0 bg-transparent w-100 text-start"
                    style={{
                        color: 'black',
                        cursor: 'pointer',
                        backgroundColor: hoveredItem === 'logout' ? '#f0f0f0' : 'transparent',
                        padding: '5px',
                        borderRadius: '4px'
                    }}
                    onMouseEnter={() => setHoveredItem('logout')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <BoxArrowRight className="me-2" /> Logout
                </button>
            </Popover.Body>
        </Popover>
    );

    return (
        <div
            className="d-flex align-items-center justify-content-between p-3 mb-4 w-100"
            style={{ backgroundColor: '#fff', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '0', zIndex: '1', margin: '0' }}
        >
            <h1 className="h4 mb-0">{title}</h1>
            <OverlayTrigger trigger="click" placement="bottom-end" overlay={popover} rootClose>
                <Image
                    src={profileDetails.imageUrl}
                    roundedCircle
                    style={{
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                    }}
                    alt="Profile"
                />
            </OverlayTrigger>
        </div>
    );
}
