import React, { useState } from 'react';

const InviteEmployee = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Sending Invitation to:', email);
    };

    return (
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Email Input */}
                <div style={styles.formGroup}>
                <label style={{ fontWeight: 400 }} htmlFor="email">
                    Enter Email <span style={{ color: 'red' }}>*</span>
                </label>

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter employee email"
                        style={styles.input}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" style={styles.submitButton}>Send Invitation</button>
            </form>
    );
};

// Styles for the component
const styles = {
    modalContainer: {
        width: '400px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'center', // Center the heading
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px',
        position: 'relative', // So the close button stays in place
    },
    title: {
        fontSize: '24px', // Increase font size
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        right: '10px', // Move the close button to the right
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
    },
    form: {
        width: '100%',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
    },
    label: {
        marginBottom: '8px',
        fontSize: '14px',
        color: '#333',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        width: '100%',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default InviteEmployee;
