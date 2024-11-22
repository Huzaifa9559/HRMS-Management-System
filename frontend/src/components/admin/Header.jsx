import React from 'react';

export default function Header({ title }) {
    return (
        <div 
            className="d-flex align-items-center justify-content-between p-3 mb-4 w-100" // Add 'w-100' for full width
            style={{ backgroundColor: '#fff', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '0', zIndex: '1', margin: '0' }} // Removed margin and added sticky positioning
        >
            <h1 className="h4 mb-0">{title}</h1>
        </div>
    );
}
