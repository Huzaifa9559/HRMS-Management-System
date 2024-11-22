import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, OverlayTrigger, Popover } from 'react-bootstrap';
import { PersonCircle, Key, BoxArrowRight } from 'react-bootstrap-icons';

export default function Header({ title }) {
    const navigate = useNavigate();

    const profileDetails = {
        name: 'Katya Schleifer',
        title: 'UI UX Designer',
        imageUrl: 'https://img.freepik.com/free-photo/human-face-expressions-emotions-positive-joyful-young-beautiful-female-with-fair-straight-hair-casual-clothing_176420-15188.jpg',
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
                <a
                    onClick={handleProfileClick}
                    className="d-flex align-items-center mb-2"
                    style={{
                        textDecoration: 'none',
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
                </a>
                <a
                    onClick={handleChangePasswordClick}
                    className="d-flex align-items-center mb-2"
                    style={{
                        textDecoration: 'none',
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
                </a>
                <a
                    onClick={handleLogoutClick}
                    className="d-flex align-items-center"
                    style={{
                        textDecoration: 'none',
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
                </a>
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
