import { useState } from 'react';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Replace this with your actual API call
        console.log('Sending password reset link to:', email);

        // Simulate successful submission
        setSubmitted(true);
    };

    const handleResend = () => {
        console.log('Re-sending password reset link...');
        // Optionally re-trigger the same submission or API call
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="absolute top-0 left-0 w-full p-4 bg-black">
                <img
                    src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif"
                    alt="Kensium Logo"
                    className="h-8 ml-4"
                />
            </div>


            <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="bg-white border rounded-lg p-8 w-full max-w-md shadow-md text-center">
                {submitted ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="text-green-500 text-4xl">✅</div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">We have emailed your password reset link.</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            If your email is registered, you will receive an email to reset your password.
                        </p>
                        <button
                            onClick={handleResend}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
                        >
                            Re-send Link
                        </button>
                        <a href="#" className="text-green-600 text-sm font-medium">
                            Need Help?
                        </a>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            No problem. Just let us know your email address and we will email you a password reset link.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="text-left mb-4">
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-green-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="xyz@gmail.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                            >
                                Send Link
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}
