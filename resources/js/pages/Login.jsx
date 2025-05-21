import React, { useState } from "react";
import { Link } from 'react-router-dom';
import CreateAccountForm from "../Layouts/CreateAccountForm";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    console.log(isLogin , "islogged in ");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in:", { email, password });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left section */}
            <div className="w-1/2 bg-[#0b0d2e] text-white flex flex-col justify-center p-16 rounded-r-[40px]">
                <h1 className="text-3xl font-bold leading-tight mb-4">
                    Evaluate your Commerce <br /> business's performance.
                </h1>
                <p className="text-sm text-gray-300 max-w-sm">
                    Discover how your online store performs, compare with industry
                    benchmarks, and get expert recommendations to grow your business.
                </p>
            </div>

            {/* Right section */}
            <div className="w-1/2 bg-white p-12 flex flex-col justify-center relative">
                {/* Logo */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold mb-1 tracking-wide">
                        {/*<span className="border-r-2 border-black pr-2 font-mono">K</span>{" "}*/}
                        KENSIUM
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 border rounded overflow-hidden">
                    <button
                        className={`w-1/2 py-2 font-medium ${isLogin ? "bg-black text-white" : "bg-gray-100"}`}
                        onClick={() => setIsLogin(true)}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`w-1/2 py-2 font-medium ${!isLogin ? "bg-black text-white" : "bg-gray-100"}`}
                        onClick={() => setIsLogin(false)}
                        type="button"
                    >
                        Create an account
                    </button>
                </div>

                {/* Login form */}
                {isLogin?(
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="xyz@gmail.com"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Password *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter Password"
                                required
                            />
                            <span className="absolute top-9 right-3 cursor-pointer">👁️</span>
                        </div>

                        {/* Remember me and forgot password */}
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Remember Me
                            </label>
                            <Link to="/forget-password" className="text-green-600 font-medium">Forgot Password?</Link>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        >
                            Login
                        </button>
                    </form>
                ):(
                    <CreateAccountForm/>
                )}

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                {/* Social login buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <button className="p-2 border rounded-full hover:bg-gray-100">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    </button>
                    <button className="p-2 border rounded-full hover:bg-gray-100">
                        <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" alt="Apple" className="h-5 w-5" />
                    </button>
                    <button className="p-2 border rounded-full hover:bg-gray-100">
                        <img src="https://www.svgrepo.com/show/475700/microsoft-color.svg" alt="Microsoft" className="h-5 w-5" />
                    </button>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                    By signing up to create an account I accept Company’s{" "}
                    <a href="#" className="underline">
                        Terms of use
                    </a>{" "}
                    &{" "}
                    <a href="#" className="underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
}
