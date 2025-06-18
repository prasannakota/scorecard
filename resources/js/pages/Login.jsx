import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
          className="w-full custombtn"
          disabled={verifyingEmail}
        >
          {verifyingEmail ? 'Please wait...' : 'Login'}
        </Button>

        <div className="flex items-center justify-center">
          <Separator className="flex-grow" />
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <Separator className="flex-grow" />
        </div>

        <div className="flex justify-center gap-4 mt-4">
                <a className="px-8 py-2 rounded-md border   border-blue10 hover:bg-white inline-flex items-center justify-center"
                  href={`${backendUrl}/auth/google`} >
                    <svg  className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81818H12V14.46H18.4582C18.18 15.96 17.3345 17.2309 16.0636 18.0818V21.0927H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z" fill="#4285F4"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C15.24 24 17.9564 22.9254 19.9418 21.0927L16.0636 18.0818C14.9891 18.8018 13.6145 19.2272 12 19.2272C8.87455 19.2272 6.22909 17.1163 5.28546 14.28H1.27637V17.3891C3.25091 21.3109 7.30909 24 12 24Z" fill="#34A853"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.28545 14.28C5.04545 13.56 4.90909 12.7909 4.90909 12C4.90909 11.2091 5.04545 10.44 5.28545 9.71999V6.6109H1.27636C0.463636 8.2309 0 10.0636 0 12C0 13.9364 0.463636 15.7691 1.27636 17.3891L5.28545 14.28Z" fill="#FBBC05"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.77273C13.7618 4.77273 15.3436 5.37818 16.5873 6.56727L20.0291 3.12545C17.9509 1.18909 15.2345 0 12 0C7.30909 0 3.25091 2.68909 1.27637 6.61091L5.28546 9.72C6.22909 6.88364 8.87455 4.77273 12 4.77273Z" fill="#EA4335"/>
                      </svg>
                </a>                
                <Button
                  variant="outline"
                  className="px-8 py-2 rounded-md border   border-blue10 hover:bg-white inline-flex items-center justify-center"
                  onClick={() => {
                    window.location.href = "/auth/apple";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12.5547 5.53846C13.638 5.53846 14.9959 4.8061 15.8045 3.82962C16.5369 2.94469 17.0709 1.70884 17.0709 0.472982C17.0709 0.30515 17.0556 0.137317 17.0251 0C15.8198 0.0457724 14.3703 0.808646 13.5006 1.8309C12.8141 2.60903 12.1885 3.82963 12.1885 5.08074C12.1885 5.26383 12.219 5.44692 12.2343 5.50795C12.3106 5.5232 12.4326 5.53846 12.5547 5.53846ZM8.7403 24C10.2203 24 10.8764 23.0083 12.7225 23.0083C14.5992 23.0083 15.0111 23.9695 16.6589 23.9695C18.2762 23.9695 19.3595 22.4743 20.3818 21.0095C21.5261 19.3312 21.999 17.6834 22.0296 17.6071C21.9228 17.5766 18.8255 16.3102 18.8255 12.7552C18.8255 9.67324 21.2667 8.28481 21.404 8.178C19.7867 5.85887 17.3303 5.79784 16.6589 5.79784C14.8433 5.79784 13.3633 6.89638 12.4326 6.89638C11.4256 6.89638 10.0982 5.85887 8.5267 5.85887C5.53624 5.85887 2.5 8.33058 2.5 12.9994C2.5 15.8983 3.62905 18.965 5.01748 20.9485C6.20756 22.6268 7.24507 24 8.7403 24Z" fill="black"/>
                </svg>
                </Button>
                <a className="px-8 py-2 rounded-md border   border-blue10 hover:bg-white inline-flex items-center justify-center"
                  href={`${backendUrl}/auth/microsoft`} >
                  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.5 1H1.5V10H10.5V1Z" fill="#F25022"/>
                              <path d="M10.5 11H1.5V20H10.5V11Z" fill="#00A4EF"/>
                              <path d="M20.5 1H11.5V10H20.5V1Z" fill="#7FBA00"/>
                              <path d="M20.5 11H11.5V20H20.5V11Z" fill="#FFB900"/>
                              </svg>
                </a>
          </div>                
          <div className="mt-6 text-center text-xs text-gray-500 px-6">
              By signing up to create an account, I accept the Company’s{" "}<br/>
              <Link to="/terms" className="underline text-black400 hover:no-underline">
                  Terms of Use
              </Link>{" "}
              &{" "}
              <Link to="/privacy-policy" className="underline text-black400 hover:no-underline">
                  Privacy Policy
              </Link>.
          </div>
      </form>
    </div>
  );
};

export default Login;
