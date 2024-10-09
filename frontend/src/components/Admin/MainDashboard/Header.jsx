import React from 'react';

const Header = ({ title }) => { // The "title" prop passed to the Header component
    return (
        <div className="header-container mb-4">
            <h1 className="h4">{title}</h1> {/* Use the prop for dynamic title */}
        </div>
    );
};

export default Header;
