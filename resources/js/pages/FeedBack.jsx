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

export default function FeedBack() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name:"",
        email: "",
        rating: "",
        feedback: "",
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
        const getAuthToken = () => sessionStorage.getItem("authorization");
        const token = getAuthToken();
        try {
            const response = await axios.post(
                "/api/user/feedback",
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
                setSuccess("Thank you for your feedback!");
                setFormData({
                    first_name: "",
                    last_name:"",
                    email: "",
                    rating: "",
                    feedback: "",
                    consent: false,
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setError(Object.values(error.response.data.errors).flat().join(" "));
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Feedback submission failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg bg-white p-6 rounded shadow">
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}
                <h2 className="text-2xl font-bold text-center">Feedback Form </h2>
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="rating" className="block mb-1 text-gray-700">Rating</Label>
                    <Select
                        value={formData.rating}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, rating: value }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Select Rating --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 - Very Dissatisfied</SelectItem>
                            <SelectItem value="2">2 - Dissatisfied</SelectItem>
                            <SelectItem value="3">3 - Neutral</SelectItem>
                            <SelectItem value="4">4 - Satisfied</SelectItem>
                            <SelectItem value="5">5 - Very Satisfied</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="feedback" className="block mb-1 text-gray-700">Feedback</Label>
                    <Textarea
                        id="feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        required
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
                    <Label htmlFor="consent">I agree to be contacted regarding this feedback.</Label>
                </div>



                <Button type="submit" className="w-full">
                    Submit Feedback
                </Button>
            </form>
        </div>
    );
}
