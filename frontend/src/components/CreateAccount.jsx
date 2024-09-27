import React, { useState } from 'react';


const countryCodes = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
];

const designations = ['Product Designer', 'Software Engineer', 'Project Manager', 'HR Manager', 'Marketing Specialist'];
const departments = ['Design', 'Engineering', 'Project Management', 'Human Resources', 'Marketing'];

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        employeeName: '',
        countryCode: '+1',
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        designation: '',
        department: '',
        agreeTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number format';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeName: formData.employeeName,
                    phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
                    address: formData.address,
                    password: formData.password,
                    designation: formData.designation,
                    department: formData.department,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('Account created successfully!');
                // Reset form or redirect user
            } else {
                setSubmitMessage(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setSubmitMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Left side */}
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white bg-primary p-4 p-lg-5">
                    <div className="text-center text-lg-start">
                        <div className="mb-4 d-flex justify-content-center justify-content-lg-start align-items-center">
                            <svg className="bi" width="32" height="32" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="ms-2 fs-4 fw-bold">HRMS</span>
                        </div>
                        <h1 className="display-5 fw-bold mb-4">Welcome to HRMS</h1>
                        <p className="lead">
                            Welcome to HRMS Family!
                            We are excited to have you onboard!
                            Please take a moment to create your profile so we can help you get started. As a valued member of our team, your journey toward success begins here. If you need any help during this process, our support team is always ready to assist you. Together, let's create a productive and inspiring work environment!
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="col-lg-6 bg-light p-4 p-lg-5 overflow-auto">
                    <h2 className="mb-4">Create an Account</h2>
                    <p className="text-muted mb-4">Please create your profile</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="employeeName" className="form-label">Employee Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                                id="employeeName"
                                name="employeeName"
                                value={formData.employeeName}
                                onChange={handleChange}
                                required
                            />
                            {errors.employeeName && <div className="invalid-feedback">{errors.employeeName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '120px' }}
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.code} ({country.country})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    pattern="\d{10}"
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            {errors.phoneNumber && <div className="invalid-feedback d-block">{errors.phoneNumber}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            ></textarea>
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? '🔓' : '🔐'}
                                </button>
                            </div>
                            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="designation" className="form-label">Designation</label>
                            <select
                                className={`form-select ${errors.designation ? 'is-invalid' : ''}`}
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Designation</option>
                                {designations.map((designation) => (
                                    <option key={designation} value={designation}>
                                        {designation}
                                    </option>
                                ))}
                            </select>
                            {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="department" className="form-label">Department</label>
                            <select
                                className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                            />
                            <label className="form-check-label" htmlFor="agreeTerms">
                                I agree to terms and conditions
                            </label>
                            {errors.agreeTerms && <div className="invalid-feedback">{errors.agreeTerms}</div>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>

                        {submitMessage && (
                            <div className={`mt-3 text-center ${submitMessage.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                                {submitMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}