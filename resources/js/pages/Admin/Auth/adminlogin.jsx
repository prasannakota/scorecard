import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import FlashMessage from "@/components/common/FlashMessage";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post(
                "/admin/login",
                {
                    email: formData.email,
                    password: formData.password,
                    remember: formData.remember,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                sessionStorage.setItem("authorization", response.data.token);
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                navigate("/admin/dashboard");
            } else {
                setError(response.data.message || "Login failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white w-full max-w-6xl rounded shadow overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Panel */}
                <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
                    <h2 className="text-2xl font-bold mb-3">
                        Evaluate your Commerce business's performance.
                    </h2>
                    <p>
                        Discover how your online store performs, compare with industry
                        benchmarks, and get expert recommendations to grow your business.
                    </p>
                </div>

                {/* Right Panel */}
                <div className="p-10">
                    <div className="mb-4 text-center">
                        <img src="/images/Kensiumlogo.svg" alt="Logo" className="mx-auto h-12" />
                        <h3 className="text-xl font-semibold mt-2">Admin Login</h3>
                    </div>

                    <FlashMessage />
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                            />
                            <Label htmlFor="remember">Remember Me</Label>
                        </div>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                        <div className="text-center mt-2">
                            <a href="/admin/forgot-password" className="text-sm underline text-gray-600">
                                Forgot Your Password?
                            </a>
                        </div>

                        <div className="my-3 text-center text-gray-500">OR</div>

                        <p className="text-center text-xs text-muted">
                            By signing in, you accept KENSIUM Company's <br />
                            <a href="#" className="underline">Terms of Use</a> &{" "}
                            <a href="#" className="underline">Privacy Policy</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
