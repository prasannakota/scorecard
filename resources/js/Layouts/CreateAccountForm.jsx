import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function CreateAccountForm() {
    const form = useForm();
    const { register, handleSubmit, formState: { errors } } = form;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = (data) => {
        console.log("Register Data:", data);
    };

    return (



            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* First + Last Name */}
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">First Name *</label>
                        <Input placeholder="John" {...register("firstName", { required: true })} />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">Last Name *</label>
                        <Input placeholder="Doe" {...register("lastName", { required: true })} />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Work Email *</label>
                    <Input type="email" placeholder="xyz@gmail.com" {...register("email", { required: true })} />
                </div>

                {/* Mobile */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Mobile *</label>
                    <Input type="tel" placeholder="(___) ___-____" {...register("mobile", { required: true })} />
                </div>

                {/* Password */}
                <div className="relative">
                    <label className="block mb-1 text-sm font-medium">Password *</label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...register("password", { required: true })}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-[34px]"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <label className="block mb-1 text-sm font-medium">Confirm Password *</label>
                    <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter Password"
                        {...register("confirmPassword", { required: true })}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-[34px]"
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        className="mr-2"
                        {...register("terms", { required: true })}
                    />
                    <span className="text-sm">
            I agree to commerce scorecard <a className="text-blue-600 underline">Privacy Policy</a> & <a className="text-blue-600 underline">Terms</a>
          </span>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Create Account
                </Button>

            </form>
    );
}
