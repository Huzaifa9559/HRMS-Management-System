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
        <div className="flex flex-col lg:flex-row min-h-screen bg-blue-500">
            {/* Left side */}
            <div className="w-full lg:w-1/2 bg-blue-500 flex flex-col justify-start items-center lg:items-center p-2 lg:p-4 text-white mx-auto lg:ml-4 mt-8">

                <div className="max-w-md w-full">
                    <div className="mb-8 flex items-center justify-center lg:justify-start">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="ml-2 text-2xl font-bold">HRMS</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">Welcome to HRMS</h1>
                    <p className="text-base lg:text-lg text-center lg:text-left">
                        Welcome to HRMS Family!
                        We are excited to have you onboard!
                        Please take a moment to create your profile so we can help you get started. As a valued member of our team, your journey toward success begins here. If you need any help during this process, our support team is always ready to assist you. Together, let's create a productive and inspiring work environment!
                    </p>
                </div>
            </div>


            {/* Right side */}
            <div className="w-full lg:w-1/2 bg-white p-6 lg:p-12 overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Create an Account</h2>
                <p className="text-gray-600 mb-6 lg:mb-8">Please create your profile</p>

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    <div>
                        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                        <input
                            type="text"
                            id="employeeName"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.employeeName ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {errors.employeeName && <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="w-1/4 p-2 border border-gray-300 rounded-l"
                            >
                                {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.code} ({country.country})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-3/4 p-2 border rounded-r ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                pattern="\d{10}"
                                placeholder="1234567890"
                                required
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            rows="3"
                            required
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <span className="text-gray-400">&#128065;&#65039;</span>
                                ) : (
                                    <span className="text-gray-400">&#128065;</span>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <select
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        >
                            <option value="">Select Designation</option>
                            {designations.map((designation) => (
                                <option key={designation} value={designation}>
                                    {designation}
                                </option>
                            ))}
                        </select>
                        {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className={`mr-2 ${errors.agreeTerms ? 'border-red-500' : ''}`}
                                required
                            />
                            <span className="text-sm text-gray-700">I agree to terms and conditions</span>
                        </label>
                        {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {submitMessage && (
                        <p className={`text-center ${submitMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                            {submitMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}