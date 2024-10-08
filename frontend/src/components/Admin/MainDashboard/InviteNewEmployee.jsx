import React from 'react';

export default function InviteNewEmployee({ onClose }) {
    return (
        <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Invite New Employee</h2>
                <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                    style={{ padding: '0', background: 'none', border: 'none' }}
                >
                    ×
                </button>
            </div>

            <form className="flex flex-col space-y-6">
                {/* Department Select */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Department <span className="text-red-500">*</span>
                    </label>
                    <select className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Select Departments</option>
                        <option>Designing</option>
                        <option>Development</option>
                        <option>HR</option>
                    </select>
                </div>

                {/* Designation Select */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Designation <span className="text-red-500">*</span>
                    </label>
                    <select className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Select Designation</option>
                        <option>UI UX designer</option>
                        <option>Frontend Developer</option>
                        <option>HR Manager</option>
                    </select>
                </div>

                {/* Email Input */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter employee email"
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md shadow-sm text-sm font-medium transition-all"
                >
                    Send Invitation
                </button>
            </form>
        </div>
    );
}
