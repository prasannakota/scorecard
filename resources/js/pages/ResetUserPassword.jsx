import React, {useEffect, useState} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from "axios";
import { useParams } from 'react-router-dom';
import {CheckCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "../components/ui/alert.js";


export default function ResetUserPassword() {
    const [submitted, setSubmitted] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    let { token } = useParams();
    useEffect(()=> {
        if(token !== "") {
            setSubmitted(true);
        } else {
            setSubmitted(false);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return;
        }

        const regex = /^(?=.*[\d\W]).+$/;
        if (!regex.test(newPassword)) {
            setPasswordError("Password should contain at least one number or symbol.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        axios.post(`/api/reset-user-password`, {
            token:token,
            password: newPassword
        },{
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
            }, withCredentials: true,}).then((response) => {
            if(response.data.code === 200) {
                console.log(response);
                setPasswordUpdated(true);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md px-5  py-6 md:px-8 md:py-10 border border-gray10 md:max-w-[620px]">
                {passwordUpdated ?
                    <div>
                        <Alert variant="default" className="mb-6 border-green-500 bg-green-50 text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <AlertTitle className="font-semibold">Success</AlertTitle>
                            <AlertDescription>You password has beeb updated successfully.</AlertDescription>
                        </Alert>
                        <div className="button-container">
                            <a href="/" className="btn button">Back to Login</a>
                        </div>
                    </div>
                    :
                    <>
                        {submitted ?
                            <div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                    <Button type="submit" className="w-full custombtn">
                                        Save
                                    </Button>
                                </form>

                            </div>
                            :
                            <div>
                                <span>Please initiate the password reset request from Login page.</span>
                                <div className="button-container">
                                    <a href="/login" className="btn button">Login</a>
                                </div>
                            </div>
                        }
                    </>
                }
            </Card>
        </div>
                    );
                }
