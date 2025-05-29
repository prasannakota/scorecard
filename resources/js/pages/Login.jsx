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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">User Login</h2>

      <div>
        <Label htmlFor="email">Email address*</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="relative">
        <Label htmlFor="password">Password*</Label>
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            name="remember"
            checked={formData.remember}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, remember: checked }))
            }
          />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Link to="/forget-password" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

      <Button type="submit" className="w-full">
        Log In
      </Button>

      <Separator />
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-500">or</p>
      </div>
      <Separator />

      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={() => alert('Google login coming soon...')}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          aria-label="Login with Google"
        >
          <BsGoogle className="text-xl text-gray-700" />
        </button>

        {/*<button
          type="button"
          onClick={() => alert('Apple login coming soon...')}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          aria-label="Login with Apple"
        >
          <FaApple className="text-xl text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() => alert('Microsoft login coming soon...')}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          aria-label="Login with Microsoft"
        >
          <FaMicrosoft className="text-xl text-gray-700" />
        </button>*/}
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 px-6">
        By signing up to create an account, I accept the Company’s{" "}
        <Link to="/terms" className="underline text-blue-600 hover:text-blue-700">
          Terms of Use
        </Link>{" "}
        &{" "}
        <Link to="/privacy-policy" className="underline text-blue-600 hover:text-blue-700">
          Privacy Policy
        </Link>.
      </div>
    </form>
  );
};

export default Login;
