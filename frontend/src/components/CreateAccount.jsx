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
    const paragraphText = `A  new era of HR management, where efficiency meets simplicity. Empowering you to effortlessly manage everything from employee details and attendance to documents and salary slips—all in one place.`;

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

        const headingInterval = setInterval(typeHeading, 170);

        let paragraphIndex = 0;
        const typeParagraph = () => {
            const paragraphInterval = setInterval(() => {
                if (paragraphIndex <= paragraphText.length) {
                    setTypedTextParagraph((prev) => prev + paragraphText.charAt(paragraphIndex));
                    paragraphIndex++;
                } else {
                    clearInterval(paragraphInterval);
                }
            }, 10);
        };

        return () => {
            clearInterval(headingInterval);
        };
    }, []);

    const [passwordAlert, setPasswordAlert] = useState('');

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
        setErrors(formErrors);
        setPasswordAlert('');

        // Password validation checks
        if (formData.password !== formData.confirmPassword) {
            setPasswordAlert('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setPasswordAlert('Password must be at least 8 characters long');
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
            setPasswordAlert('Password must contain at least one capital letter');
            return;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password)) {
            setPasswordAlert('Password must contain at least one symbol');
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(formData.password)) {
            setPasswordAlert('Password must be alphanumeric and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
            return;
        }

        setPasswordAlert(''); // Clear password alert if all checks pass

        if (Object.keys(formErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/employees/create-account', {
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
                //a request for review will be sent to admin
                //once admin approves, an email will be sent to employee to login to his account, with
                //the email and password
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
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-start text-white p-3 p-lg-4"
                    style={{ backgroundColor: '#0066ff', position: 'relative', overflow: 'hidden' }}>

                    {/* Top-left logo */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
                        <svg className="bi" width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="15" height="15" rx="4" ry="4" fill="white" transform="rotate(20 12 12)" />
                            <rect x="25" y="10" width="10" height="10" rx="3" ry="3" fill="lightgreen" transform="rotate(10 25 15)" />
                            <rect x="15" y="30" width="15" height="15" rx="4" ry="4" fill="red" transform="rotate(-10 20 36)" />
                        </svg>
                        <span className="ms-2 fs-5 fw-bold">HRMS</span>
                    </div>

                    {/* Text content with typewriter effect */}
                    <div className="text-start">
                        <h1 className="display-6 fw-bold mb-2">{typedTextHeading}</h1>
                        <p className="lead" style={{ fontSize: '0.8rem' }}>{typedTextParagraph}</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center bg-light p-3 p-lg-4">
                    <div className="w-100" style={{ maxWidth: '450px' }}>
                        <h3 className="mb-3 text-center">Create an Account</h3>
                        <p className="text-muted mb-3 text-center">Please create your profile</p>

                        {/* Custom password alert */}
                        {passwordAlert && (
                            <div className="custom-alert">
                                <span className="exclamation">❗</span>
                                <span className="alert-text">{passwordAlert}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label htmlFor="employeeName" className="form-label">Employee Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="employeeName"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                <div className="input-group">
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ maxWidth: '100px' }}
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                    >
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        className="form-control form-control-sm"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Full Address"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? '🔓' : '🔐'}
                                        </button>
                                    </div>
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control form-control-sm ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                </div>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="designation" className="form-label">Designation</label>
                                <select
                                    className="form-select form-select-sm"
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
                            </div>

                            <div className="mb-2">
                                <label htmlFor="department" className="form-label">Department</label>
                                <select
                                    className="form-select form-select-sm"
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
                            </div>

                            <div className="mb-2 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <br />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {/* Custom submit message alert */}
                            {submitMessage && (
                                <div className="custom-alert mt-3">
                                    <span className={`alert-text ${submitMessage.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                                        {submitMessage.includes('successfully') ? '✔️ ' : '❗ '}{submitMessage}
                                    </span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-alert {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }

                .exclamation {
                    font-size: 1.2rem;
                    margin-right: 5px;
                    color: red;
                }

                .alert-text {
                    font-size: 0.9rem;
                    color: red;
                }
            `}</style>
        </div>
    );
}
