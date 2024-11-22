import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-phone-input-2/lib/style.css';

const phoneUtil = PhoneNumberUtil.getInstance();


export default function CreateAccount() {
    const [formData, setFormData] = useState({
        employeeName: '',
        countryCode: '+',
        phoneNumber: '',
        address: '',
        designation: '',
        department: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Fetch designations and departments from DB and admin can add it 

    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [isValidPhone, setIsValidPhone] = useState(true);
    const [countryList, setCountryList] = useState([]);
    const [phoneCountryCode, setPhoneCountryCode] = useState('');

    // Typewriter effect for heading and paragraph
    const [typedTextHeading, setTypedTextHeading] = useState('');
    const [typedTextParagraph, setTypedTextParagraph] = useState('');
    const headingText = ' Welcome to HRMS!';
    const paragraphText = `A  new era of HR management, where efficiency meets simplicity. Empowering you to effortlessly manage everything from employee details and attendance to documents and salary slips—all in one place.`;

    // Fetch country data with flags
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then((response) => {
                const countries = response.data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2.toLowerCase(), // Use cca2 code for country (ISO 3166-1 alpha-2)
                    flag: country.flags.png || country.flags.svg, // Fetch flag in png or svg
                    dialCode: country.idd.root ? `${country.idd.root}${country.idd.suffixes[0]}` : '', // Combine root and suffix
                }));
                setCountryList(countries);
            })
            .catch((error) => {
                console.error('Error fetching country data:', error);
            });
    }, []);

    // Fetch designations and departments from the database
    useEffect(() => {
        const fetchDesignationsAndDepartments = async () => {
            try {
                const response = await axios.get('/api/public/department');
                setDesignations(response.data.data);
                const response2 = await axios.get('/api/public/designation');
                setDepartments(response2.data.data);
            } catch (error) {
                console.error('Error fetching designations and departments:', error);
            }
        };

        fetchDesignationsAndDepartments();
    }, []);

    // Phone number validation
    const validatePhoneNumber = (phoneNumber, countryCode) => {
        try {
            const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode.toUpperCase());
            const isValid = phoneUtil.isValidNumber(parsedNumber);
            setIsValidPhone(isValid);
        } catch (error) {
            setIsValidPhone(false);
        }
    };
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
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.department) newErrors.department = 'Department is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            return;
        }
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/employees/auth/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeName: formData.employeeName,
                    phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
                    address: formData.address,
                    designation: formData.designation,
                    department: formData.department,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('Request sent successfully!');
            } else {
                setSubmitMessage(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setSubmitMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                                <PhoneInput
                                    country={'us'} // Default country
                                    value={formData.phoneNumber}
                                    onChange={(phoneNumber, country) => {
                                        setFormData((prevData) => ({ ...prevData, phoneNumber }));
                                        setPhoneCountryCode(country.countryCode); // Set the country code
                                        validatePhoneNumber(phoneNumber, country.countryCode); // Validate with country code
                                    }}
                                    inputClass="form-control form-control-sm"
                                    disableDropdown={false} // Allow the dropdown for country selection
                                    enableSearch={true} // Allow search in the country dropdown
                                    disableCountryCode={false} // Make sure the country code is editable
                                    specialLabel="Phone Number" // Label for phone input
                                    limitMaxLength={true} // Enforce the length limit based on the country format
                                />
                                {!isValidPhone && <div className="text-danger">Invalid phone number</div>}
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
                                        <option key={designation.designation_name} value={designation.designation_name}>
                                            {designation.designation_name}
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
                                    {departments.map((d) => (
                                        <option key={d.department_name} value={d.department_name}>
                                            {d.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <br />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting for Request...' : 'Submit for Request'}
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

            <style>{`
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

                .input-group {
                    position: relative;
                    z-index: 1; /* Ensure the input group, including the eye icon, remains under the dropdown */
                }

                .btn-outline-secondary {
                    z-index: 0; /* Set lower z-index for the button to avoid overlapping */
                }

                .react-tel-input .flag-dropdown {
                    z-index: 10; /* Increase z-index of the flag dropdown to ensure it stays on top */
                }
            `}</style>
        </div>
    );
}