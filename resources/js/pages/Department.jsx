import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export default function Department() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
    });

    const sampleDepartments = [
        { id: 1, name: "Marketing", description: "Handles marketing strategies", is_active: true },
        { id: 2, name: "Sales", description: "Responsible for product sales", is_active: true },
        { id: 3, name: "HR", description: "Manages human resources", is_active: false },
    ];

    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchDepartments = async () => {
        try {
            const token = sessionStorage.getItem("authorization");
            const response = await axios.get("/api/fetch-data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const result = response.data;
            const list = Array.isArray(result)
                ? result
                : Array.isArray(result.data)
                    ? result.data
                    : [];

            setDepartments(list);
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

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
            const token = sessionStorage.getItem("authorization");
            const response = await axios.post("/api/add-department", formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.status === 200 || response.data.success) {
                setSuccess("Department created successfully!");
                setFormData({ name: "", description: "", is_active: true });
                fetchDepartments();
                setTimeout(() => {
                    setShowModal(false);
                    setSuccess(null);
                }, 1000);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMsg = Object.values(err.response.data.errors).flat().join(" ");
                setError(errorMsg);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="container p-4">
            {/* Add Department Button */}
            <Button onClick={() => setShowModal(true)} className="mb-4">
                Add Department
            </Button>

            {/* Department List */}
            <div className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-semibold mb-3">Departments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(departments.length === 0 ? sampleDepartments : departments).map((dept) => (
                        <div
                            key={dept.id}
                            className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition"
                        >
                            <h4 className="text-md font-semibold text-gray-800">{dept.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
                            <div
                                className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                    dept.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {dept.is_active ? "Active" : "Inactive"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Create New Department</h2>

                        {error && <div className="text-red-500 mb-2">{error}</div>}
                        {success && <div className="text-green-600 mb-2">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_active: checked,
                                        }))
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <Button type="submit" className="w-full">
                                Create Department
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
