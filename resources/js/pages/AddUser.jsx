import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { BsGoogle } from "react-icons/bs";
// import { FaApple, FaMicrosoft } from 'react-icons/fa';

const usMobileRegex = /^(\+1)?\d{10}$/;

const formSchema = z
    .object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email"),
        mobile: z.string().regex(usMobileRegex, {
            message: "Enter a valid mobile number (10 digits)",
        }),
        password: z.string().min(6, "Password must be at least 6 characters"),
        password_confirmation: z.string(),
        profile_picture: z.any().optional(),
        terms: z.literal(true, {
            errorMap: () => ({ message: "You must agree to the terms and policies" }),
        }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

export default function AddUser() {
    const [adminId, setAdminId] = useState(null);
    useEffect(() => {
        //if (typeof window !== "undefined") {
            const userData = sessionStorage.getItem("user");
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    console.log(user);
                    setAdminId(user?.id || null);
                } catch (error) {
                    console.error("Failed to parse user data from sessionStorage:", error);
                }
            }
       // }
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formMessage, setFormMessage] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            mobile: "",
            password: "",
            password_confirmation: "",
            terms: false,
            profile_picture: null,
        },
    });

    async function onSubmit(data) {
        setFormMessage(null);
        try {
            const formData = new FormData();
            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("mobile", data.mobile);
            formData.append("password", data.password);
            formData.append("password_confirmation", data.password_confirmation);
            formData.append("terms", data.terms);
            if (data.profile_picture && data.profile_picture[0]) {
                formData.append("profile_picture", data.profile_picture[0]);
            }

            if (adminId) {
                formData.append("super_user_id", adminId); // Make sure your backend accepts this field
            }

            const response = await fetch("/api/register", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                if (result?.data && typeof result.data === "object") {
                    Object.entries(result.data).forEach(([field, messages]) => {
                        const msg = Array.isArray(messages) ? messages.join(", ") : String(messages);
                        form.setError(field, { type: "server", message: msg });
                    });
                } else {
                    setFormMessage({ type: "error", text: result.message || "Registration failed." });
                }
                return;
            }

            // Success block:
            setFormMessage({ type: "success", text: "User added successfully!" });

            // Optionally reset form if desired:
            // form.reset();

            // Redirect to /dashboard after a short delay
            setTimeout(() => {
                window.location.href = "/assessment-form";
            }, 2000); // 2-second delay for user to read message


            form.reset();
        } catch (error) {
            console.error("Registration error:", error);
            setFormMessage({ type: "error", text: "An error occurred during registration." });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardContent>
                    <Form {...form}>
                        {formMessage && (
                            <div
                                className={`p-2 mb-4 rounded ${
                                    formMessage.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                }`}
                            >
                                {formMessage.text}
                            </div>
                        )}

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Work Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@company.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Mobile</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="+11234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="profile_picture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Picture</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => field.onChange(e.target.files)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? "text" : "password"} placeholder="******" {...field} />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="******" {...field} />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex items-start space-x-2 inputchekbtn">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="text-sm">
                                            <FormLabel>
                                                I agree to commerce scorecard{" "}
                                                <Link to="/privacy-policy" className="text-blue-600 underline hover:text-blue-800">
                                                    Privacy Policy
                                                </Link>{" "}
                                                &{" "}
                                                <Link to="/terms" className="text-blue-600 underline hover:text-blue-800">
                                                    Terms
                                                </Link>
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Add User
                            </Button>
                        </form>
                    </Form>

                    <div className="flex justify-center gap-4 mt-4">
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

