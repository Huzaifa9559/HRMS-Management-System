import React, { useState, useEffect } from 'react';

const countryCodes = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+92', country: 'Pakistan' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+7', country: 'Russia' },
    { code: '+55', country: 'Brazil' },
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

    // Typewriter effect for heading and paragraph
    const [typedTextHeading, setTypedTextHeading] = useState('');
    const [typedTextParagraph, setTypedTextParagraph] = useState('');
    const headingText = 'W elcome to HRMS!';
    const paragraphText = `A  new era of HR management, where efficiency meets simplicity. Empowering you to effortlessly manage everything from employee details and attendance to documents and salary slips—all in one place. With a focus on driving productivity and fostering growth, we handle the administrative work so you can focus on what truly matters: building a thriving and dynamic workforce.`;

    // Typing for Heading
    useEffect(() => {
        let headingIndex = 0;
        const typeHeading = () => {
            if (headingIndex <= headingText.length) {
                setTypedTextHeading((prev) => prev + headingText.charAt(headingIndex));
                headingIndex++;
            } else {
                clearInterval(headingInterval);
                typeParagraph();  // Start paragraph typing after heading finishes
            }
        };

        const headingInterval = setInterval(typeHeading, 170); // Slower typing speed for heading

        let paragraphIndex = 0;
        const typeParagraph = () => {
            const paragraphInterval = setInterval(() => {
                if (paragraphIndex <= paragraphText.length) {
                    setTypedTextParagraph((prev) => prev + paragraphText.charAt(paragraphIndex));
                    paragraphIndex++;
                } else {
                    clearInterval(paragraphInterval);
                }
            }, 10);  // Faster typing speed for paragraph
        };

        return () => {
            clearInterval(headingInterval);
        };
    }, []);

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
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-start text-white p-4 p-lg-5" 
                    style={{
                        backgroundColor: '#0066ff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                    
                    {/* Top-left logo */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <svg className="bi" width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="15" height="15" rx="4" ry="4" fill="white" transform="rotate(20 12 12)" />
                            <rect x="25" y="10" width="10" height="10" rx="3" ry="3" fill="lightgreen" transform="rotate(10 25 15)" />
                            <rect x="15" y="30" width="15" height="15" rx="4" ry="4" fill="red" transform="rotate(-10 20 36)" />
                        </svg>
                        <span className="ms-2 fs-4 fw-bold">HRMS</span>
                    </div>
    
                    {/* Text content with typewriter effect */}
                    <div className="text-start">
                        <h1 className="display-5 fw-bold mb-4">{typedTextHeading}</h1>
                        <p className="lead" style={{ fontSize: '0.9rem' }}>{typedTextParagraph}</p>
                    </div>
                </div>
                {/* Right side */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center bg-light p-4 p-lg-5">
                    <div className="w-100" style={{ maxWidth: '500px' }}> {/* Limit the form's width */}
                        <h2 className="mb-4 text-center">Create an Account</h2>
                        <p className="text-muted mb-4 text-center">Please create your profile</p>
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
                                    placeholder="Enter your full name"
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
                                    placeholder="Enter your full address"
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
                                        placeholder="Create a strong password"
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
                                    placeholder="Re-enter your password"
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
                            <br />
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
        </div>
    );
}
