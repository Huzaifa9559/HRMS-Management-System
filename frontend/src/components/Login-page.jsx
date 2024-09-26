import React, { useState } from 'react';

export default function Component() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted', { email, password, rememberMe });
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-500 flex-col justify-between p-12">
                <div>
                    <h1 className="text-white text-3xl font-bold">HRMS</h1>
                </div>
                <div>
                    <h2 className="text-white text-4xl font-bold mb-4">Welcome to HRMS</h2>
                    <p className="text-blue-100">
                        Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.
                    </p>
                </div>
                <div></div> {/* Empty div for spacing */}
            </div>

            {/* Right side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">Login to HRMS</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="mr-2"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-blue-500 hover:text-blue-800">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}