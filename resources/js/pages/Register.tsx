import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { BsGoogle } from "react-icons/bs";
import { FaApple, FaMicrosoft } from 'react-icons/fa';

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

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

    async function onSubmit(data: any) {
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

            const response = await fetch("/api/register", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                if (result?.data && typeof result.data === "object") {
                    // Inject API errors into react-hook-form
                    Object.entries(result.data).forEach(([field, messages]) => {
                        const msg = Array.isArray(messages) ? messages.join(", ") : String(messages);
                        form.setError(field as any, { type: "server", message: msg });
                    });
                } else {
                    // Fallback global error
                    setFormMessage({ type: "error", text: result.message || "Registration failed." });
                }
                return;
            }

            // Success case
            setFormMessage({ type: "success", text: result.meta || "Registration successful!" });
            form.reset();
        } catch (error) {
            console.error("Registration error:", error);
            setFormMessage({ type: "error", text: "An error occurred during registration." });
        }
    }

    return (
        <div className="flex items-center justify-center flex-col ">
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

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                            {/* First and Last Name */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 inputstyle relative mb-4">
                                            <FormLabel>First Name<em className="text-blue200">*</em></FormLabel>
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
                                        <FormItem className="flex-1 inputstyle relative mb-4">
                                            <FormLabel>Last Name<em className="text-blue200">*</em></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email and Mobile */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 inputstyle relative mb-4">
                                            <FormLabel>Work Email<em className="text-blue200">*</em></FormLabel>
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
                                        <FormItem className="flex-1 inputstyle relative mb-4">
                                            <FormLabel>Mobile<em className="text-blue200">*</em></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="+11234567890"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Profile Picture Upload */}
                            <FormField control={form.control} name="profile_picture" render={({ field }) => (
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
                            )} />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex-1 inputstyle relative mb-4">
                                        <FormLabel>Password<em className="text-blue200">*</em></FormLabel>
                                        <FormControl>
                                            <div className="inputstyle relative mb-4">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="******"
                                                    {...field}
                                                />
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
                                    <FormItem className="flex-1 inputstyle relative mb-4">
                                        <FormLabel>Confirm Password<em className="text-blue200">*</em></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="******"
                                                    {...field}
                                                />
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
                                    <FormItem className="flex items-start space-x-2 relative mb-4 inputchekbtn">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                
                                            />
                                        </FormControl>
                                        <div className="inline-flex text-base customlabel">
                                            <FormLabel>
                                                I agree to commerce scorecard{" "}
                                                <Link
                                                    to="/privacy-policy"
                                                    className="underline hover:no-underline"
                                                >
                                                    Privacy Policy
                                                </Link>{" "}
                                                &{" "}
                                                <Link
                                                    to="/terms"
                                                    className="underline hover:no-underline"
                                                >
                                                    Terms
                                                </Link>
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full custombtn">
                                Create Account
                            </Button>
                        </form>
                    </Form>

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
                        to="/login/microsoft"
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
        </div>
    );
}
