import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminSidebarLayout from "./AdminSidebarLayout";

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const containerRef = useRef(null);

    // API Functions
    const fetchQuestions = async () => {
        try {
            const token = sessionStorage.getItem("authorization");
            const response = await fetch("/api/fetch-questions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setQuestions(data);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch questions:", err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleClick = (questionId) => {
        window.open(`/admin/manage-questions/${questionId}`, '_blank');
    };

    // Remove error check since we're using static data

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = '';
        const sourceIndex = e.dataTransfer.getData('text/plain');
        
        const reorderedQuestions = [...questions];
        const [removed] = reorderedQuestions.splice(sourceIndex, 1);
        reorderedQuestions.splice(targetIndex, 0, removed);
        
        setQuestions(reorderedQuestions);
    };

    const saveOrder = async () => {
        try {
            const token = sessionStorage.getItem("authorization");
            const response = await fetch("/api/save-question-order", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order: questions.map(q => q.id) })
            });

            if (!response.ok) {
                throw new Error('Failed to save order');
            }

            alert('Question order saved successfully!');
        } catch (err) {
            console.error('Error saving order:', err);
            alert('Failed to save question order');
        }
    };

    return (
        <AdminSidebarLayout>
        <div className="container p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Questions List</h1>
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => window.open('/admin-managequestions', '_blank')}
                >
                    <Plus className="h-4 w-4" />
                    Add New Question
                </Button>
            </div>
            
            <div className="space-y-4">
                <div ref={containerRef} className="space-y-4">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="bg-white rounded-lg shadow-md p-6 cursor-move hover:shadow-lg transition-shadow"
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">ID: {question.id}</span>
                            </div>
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Question
                            </div>
                            <div className="text-gray-800 font-medium">
                                {question.question_text}
                            </div>
                            <div className="mt-2 flex gap-4">
                                <span className="text-xs text-gray-500">Drag handle</span>
                                <div className="w-6 h-6 bg-gray-200 rounded-full cursor-move hover:bg-gray-300" />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleClick(question.id)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </AdminSidebarLayout>
    );
}