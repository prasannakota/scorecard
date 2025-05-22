import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { BsGoogle } from "react-icons/bs";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle login form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  try {
    const response = await axios.post(
      "/login",
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

    if (response.data.code === 200) {
      setSuccess("Login successful!");
      // navigate('/dashboard'); 
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      setError(Object.values(error.response.data.errors).flat().join(" "));
    } else if (error.response && error.response.data && error.response.data.message) {
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
        <Label htmlFor="email">Email address</Label>
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

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

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

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <Button type="submit" className="w-full">
        Log In
      </Button>
      <Separator />
      <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500">or</p>
        </div>
      <Separator />
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => alert("Google login coming soon...")}
      >
        <BsGoogle className="text-lg" />
        Continue with Google
      </Button>
    </form>
  );
};

export default Login;
