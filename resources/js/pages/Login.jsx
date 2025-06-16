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

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
      if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).flat().join(" "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full  mx-auto">

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
          onChange={handleChange}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

      <Button type="submit" className="w-full custombtn">
        Log In
      </Button>

      <Separator />
      <div className="flex items-center justify-center uppercase">
        <span className="text-base text-gary300">OR</span>
      </div>
      <Separator />

      <div className="flex justify-center gap-4 mt-4">
        <Link
          to="http://localhost:8000/auth/google"
          className="px-8 py-2 rounded-md border   border-blue10 hover:bg-white inline-flex items-center justify-center"
        >
        
          <svg  className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81818H12V14.46H18.4582C18.18 15.96 17.3345 17.2309 16.0636 18.0818V21.0927H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z" fill="#4285F4"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C15.24 24 17.9564 22.9254 19.9418 21.0927L16.0636 18.0818C14.9891 18.8018 13.6145 19.2272 12 19.2272C8.87455 19.2272 6.22909 17.1163 5.28546 14.28H1.27637V17.3891C3.25091 21.3109 7.30909 24 12 24Z" fill="#34A853"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.28545 14.28C5.04545 13.56 4.90909 12.7909 4.90909 12C4.90909 11.2091 5.04545 10.44 5.28545 9.71999V6.6109H1.27636C0.463636 8.2309 0 10.0636 0 12C0 13.9364 0.463636 15.7691 1.27636 17.3891L5.28545 14.28Z" fill="#FBBC05"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.77273C13.7618 4.77273 15.3436 5.37818 16.5873 6.56727L20.0291 3.12545C17.9509 1.18909 15.2345 0 12 0C7.30909 0 3.25091 2.68909 1.27637 6.61091L5.28546 9.72C6.22909 6.88364 8.87455 4.77273 12 4.77273Z" fill="#EA4335"/>
            </svg>
        </Link>


        {/*<button
          type="button"
          onClick={() => alert('Apple login coming soon...')}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          aria-label="Login with Apple"
        >
          <FaApple className="text-xl text-gray-700" />
        </button>}*/}

        <Link
          to="/auth/microsoft"
          type="button"
          className="px-8 py-2 rounded-md border   border-blue10 hover:bg-white inline-flex items-center justify-center"
          aria-label="Login with Microsoft"
        >
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 1H1.5V10H10.5V1Z" fill="#F25022"/>
          <path d="M10.5 11H1.5V20H10.5V11Z" fill="#00A4EF"/>
          <path d="M20.5 1H11.5V10H20.5V1Z" fill="#7FBA00"/>
          <path d="M20.5 11H11.5V20H20.5V11Z" fill="#FFB900"/>
          </svg>
        </Link>
      </div>

      <div className="mt-6 text-center text-xs text-gary300 ">
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
  );
};

export default Login;
