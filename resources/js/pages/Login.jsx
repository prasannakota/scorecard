import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { BsGoogle } from "react-icons/bs";
import { FaApple, FaMicrosoft } from 'react-icons/fa';
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/lib/UserContext";
import FlashMessage from "@/components/common/FlashMessage";

const Login = () => {
  const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_APP_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const { updateUser } = useUser();
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
    setSuccess(null);

    try {
      const response = await axios.post(
        "/api/login",
        {
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
        },
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        sessionStorage.setItem("authorization", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        updateUser(response.data.user);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      if (error.response?.data?.message === "Please verify your email address before logging in.") {
        setError("Please verify your email address before logging in.");
      } else if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).flat().join(" "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleResendVerification = async () => {
    setVerifyingEmail(true);
    setEmailError(null);

    try {
      const response = await axios.post(
        '/api/resend-verification',
        { email: formData.email },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        // Set success message in sessionStorage
        sessionStorage.setItem('flash_success', response.data.message);
        // Redirect to current page to trigger flash message
        window.location.href = window.location.pathname;
      } else {
        // Set error message in sessionStorage
        sessionStorage.setItem('flash_error', response.data.message);
        // Redirect to current page to trigger flash message
        window.location.href = window.location.pathname;
      }
    } catch (error) {
      // Set error message in sessionStorage
      sessionStorage.setItem('flash_error', error.response?.data?.message || 'Failed to resend verification email. Please try again.');
      // Redirect to current page to trigger flash message
      window.location.href = window.location.pathname;
    } finally {
      setVerifyingEmail(false);
    }
  };


  return (
    <div className="w-full mx-auto">
      <FlashMessage />
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="inputstyle relative mb-6">
          <Label htmlFor="email">Email <em className="text-blue200">*</em></Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="border"
          />
        </div>

        <div className="inputstyle relative mb-6">
          <Label htmlFor="password">Password <em className="text-blue200">*</em></Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            disabled={verifyingEmail}
            onChange={handleChange}
            required
            className="pr-10"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}

          {error === "Please verify your email address before logging in." && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={verifyingEmail}
              >
                {verifyingEmail ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 inputchekbtn">
            <Checkbox
              id="remember"
              name="remember"
              checked={formData.remember}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, remember: checked }))
              }
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
          </div>
          <Link to="/forget-password" className="text-sm text-gary200 underline hover:no-underline">
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={verifyingEmail}
        >
          {verifyingEmail ? 'Please wait...' : 'Login'}
        </Button>

        <div className="flex items-center justify-center">
          <Separator className="flex-grow" />
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <Separator className="flex-grow" />
        </div>

        <div className="flex flex-col gap-4">
          <a

            className="w-full flex items-center justify-center gap-2"
            href={`${backendUrl}/auth/google`}
          >
            <BsGoogle size={20} />
            Continue with Google
          </a>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              window.location.href = "/auth/apple";
            }}
          >
            <FaApple size={20} />
            Continue with Apple
          </Button>

          <a
            className="w-full flex items-center justify-center gap-2"
            href={`${backendUrl}/auth/microsoft`}
          >
            <FaMicrosoft size={20} />
            Continue with Microsoft
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
