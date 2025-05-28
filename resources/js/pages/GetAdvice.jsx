import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function GetAdvice() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        category: "",
        priority: "",
        message: "",
        consent: false,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const getAuthToken = () => sessionStorage.getItem("authorization");
            const token = getAuthToken();
            const response = await axios.post(
                "/api/user/advice",
                formData,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "Authorization":`Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setSuccess("Advice submitted successfully!");
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    subject: "",
                    category: "",
                    priority: "",
                    message: "",
                    consent: false,
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setError(Object.values(error.response.data.errors).flat().join(" "));
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Submission failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg bg-white p-6 rounded shadow">

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

                <h2 className="text-2xl font-bold text-center">Get Advice</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, category: value }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Select Category --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, priority: value }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Select Priority --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked }))}
                    />
                    <Label htmlFor="consent">I agree to be contacted regarding this Advice.</Label>
                </div>
                <Button type="submit" className="w-full">Submit</Button>
            </form>
        </div>
    );
}
