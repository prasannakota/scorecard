import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, UserCircle, Mail, Phone, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    fetchAssessmentOptions,
    fetchAssessment,
    saveAssessment,
    updateProfile,
    fetchUsers
} from '@/components/api/assessment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {Form, FormField, FormItem, FormMessage} from "../ui/form.js";
import { useForm } from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        profile_picture_preview: z.any().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });


export default function ProfileForm() {
    const navigate = useNavigate();

    // State
    const [organisation, setOrganisation] = useState('');
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [newDesignation, setNewDesignation] = useState(user?.role || '');
    const [newNumber, setNewNumber] = useState(user?.mobile || '');
    const [newAvatar, setNewAvatar] = useState(null); // Holds the new avatar file

    const [companyUrl, setCompanyUrl] = useState('');
    const [industry, setIndustry] = useState('');
    const [annualRevenue, setAnnualRevenue] = useState('');
    const [country, setCountry] = useState('');
    const [marketPosition, setMarketPosition] = useState('');
    const [assessmentData, setAssessMentData] = useState();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [backgroundSuccessMessage, setBackgroundSuccessMessage] = useState('');
    const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');


    const [industryOptions, setIndustryOptions] = useState([]);
    const [annualRevenueOptions, setAnnualRevenueOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [marketPositionOptions, setMarketPositionOptions] = useState([]);

    const [activeTab, setActiveTab] = useState('background'); // background | additional-users
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);


    const [isEmailDialogOpen, setEmailDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [ConfirmnewEmail, setConfirmnewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [currentPassword, setCurrentPassword] = useState("");
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            profile_picture_preview: null,
        },
    });
    const handleSaveProfile = async () => {
        // Handle saving updated name and avatar (send to backend)
        const formData = new FormData();
        formData.append('name', newName);
        if (newAvatar) {
            formData.append('avatar', newAvatar);
        }
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await updateProfile(formData);
            setSuccessMessage('Profile updated successfully!');
            console.log(response.data.user);
            updateUserSession(response.data);
            setEditing(false);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['Failed to update Profile . Please try again.'] });
            }
        } finally {
            setLoading(false);
        }

        // Send formData to backend API
        console.log('Saving profile...', newName, newAvatar);
        setEditing(false);
    };

    useEffect(() => {
        async function loadUser() {
            try {
                const userData = JSON.parse(sessionStorage.getItem('user')); // or use getUserFromSession()
                setUser(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }

        async function loadOptions() {
            try {
                const { data } = await fetchAssessmentOptions();
                setIndustryOptions(data.industrySectorOptions || []);
                setAnnualRevenueOptions(data.annualRevenueOptions || []);
                setCountryOptions(data.countryOptions || []);
                setMarketPositionOptions(data.marketPositionOptions || []);
            } catch (error) {
                console.error('Failed to load form options', error);
            }
        }

        async function loadAssessment() {
            try {
                const { data } = await fetchAssessment();
                if (data) {
                    setOrganisation(data.organization_name || '');
                    setCompanyUrl(data.website_url || '');
                    setIndustry(data.industry_sector || '');
                    setAnnualRevenue(data.annual_revenue || '');
                    setCountry(data.country || '');
                    setMarketPosition(data.market_position || '');
                    setAssessMentData(data);
                }
            } catch (error) {
                console.error('Failed to load assessment data', error);
            }
        }
        loadUser();      // new
        loadOptions();
        loadAssessment();
        fetchUsers();
    }, []);


    // Second Call
    useEffect(() => {
        if (user?.name) {
            setNewName(user.name);
        }

        if (user?.id) {
            const getUsersByAdmin = async () => {
                try {
                    const result = await fetchUsers(user.id);
                    if (result?.code === 200) {
                        setUsers(result.data);
                    } else {
                        setError("Failed to load users");
                    }
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setError("Error fetching users");
                }
            };
            getUsersByAdmin();
        }
    }, [user]);


    const getError = (field) => errors[field]?.[0];
    const handleSave = async () => {
        const payload = {
            organization_name: organisation,
            website_url: companyUrl,
            industry_sector: industry,
            annual_revenue: annualRevenue,
            country,
            market_position: marketPosition,
        };

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await saveAssessment(payload);
            setSuccessMessage('Assessment saved successfully!');
            setTimeout(() => {
                setSuccessMessage('');
                if (!assessmentData?.organization_name?.trim()) {
                    navigate('/department');
                }
            }, 3000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['Failed to save assessment. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    const [emailError, setEmailError] = useState("");
    const handleUpdateEmail = async () => {
        try {
            setSettingsSuccessMessage('');
            setEmailError("");
            if (newEmail !== ConfirmnewEmail) {
                setEmailError("Email do not match.");
                return;
            }
            const formData = new FormData();
            formData.append('email', newEmail);
            const response = await updateProfile(formData);
            setSettingsSuccessMessage("Email updated successfully.");
            updateUserSession(response.data);
            setEmailDialogOpen(false);
        } catch (error) {
            console.error("Error updating email", error);
        }
    };


    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleNextStep = () => {
        if (!currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }
        setPasswordError("");
        setStep(2);
    };

    const handleUpdatePassword = async () => {
        setPasswordError("");

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

        try {
            const response = await updateProfile({ password: newPassword, password_confirmation: confirmPassword });
            updateUserSession(response.data);
            setSettingsSuccessMessage("Password updated successfully.");
            setPasswordDialogOpen(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error updating password", error);
            setPasswordError("Something went wrong. Please try again.");
        }
    };

    const updateUserSession = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };
    return (

        <div className="flex">
            {/* Left Sidebar */}
            <aside className="w-1/4 bg-gray-100 p-6 flex flex-col items-center">
                {/* Profile Picture or Placeholder */}
                {
                    user?.profile_picture || newAvatar
                        ? <span className='rounded-full border'><img
                            src={newAvatar ? URL.createObjectURL(newAvatar) : `/storage/${user.profile_picture}?t=${Date.now()}`}
                            alt={user?.name || 'User'}
                            className="w-24 h-24 rounded-full object-cover"
                        /></span>

                        : <span className='rounded-full border'><img src="/images/profile_placeholder.png"
                                                                     alt={user?.name}/></span>
                }
                <>
                    <h6 className="mt-4 text-xs font-medium rounded-full border border-violet100 text-violet100 bg-violet50 px-3 py-1">Administrator</h6>
                    <h2 className="mt-4 text-lg text-black350 font-black capitalize">{user?.name}</h2>
                    <Separator className="my-4"/>
                    <div
                        className="text-sm text- black350 flex items-center gap-3 py-3 border-b border-neutral90 w-full text-left">
                        <Mail size={16}/> {user?.email || 'user@company.com'}</div>
                    <div className="text-sm text- black350 flex items-center gap-3 py-3 w-full text-left"><Phone
                        size={16}/> {user?.mobile || '+1 555-123-4567'}</div>

                    <Dialog open={isProfileDialogOpen} className="top-[50%]" onOpenChange={(open) => {
                        setProfileDialogOpen(open);
                        if (!open) {
                            setNewEmail("");
                            setConfirmnewEmail("");
                            setEmailError("");
                        }
                    }}>
                        <DialogTrigger asChild><Button variant="outline" className="mt-4 neutral50 !font-black rounded-md border border-neutral50 px-6 py-3 w-full text-base">Edit Profile</Button></DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Edit Profile</DialogTitle>
                            {
                                user?.profile_picture || newAvatar
                                    ? <span className='rounded-full border'><img
                                        src={newAvatar ? URL.createObjectURL(newAvatar) : `/storage/${user.profile_picture}?t=${Date.now()}`}
                                        alt={user?.name || 'User'}
                                        className="w-24 h-24 rounded-full object-cover"
                                    /></span>

                                    : <span className='rounded-full border'><img src="/images/profile_placeholder.png"
                                                                                 alt={user?.name}/></span>
                            }
                            <label>Full Name</label>
                            <Input type="input" value={newName} onChange={e => setNewName(e.target.value)}/>
                            <label>Designation</label>
                            <Input type="input" value={newDesignation} onChange={e => setNewDesignation(e.target.value)}/>
                            <label>Email</label>
                            <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
                            <label>Mobile Number</label>
                            <Input type="input" value={newNumber} onChange={e => setNewNumber(e.target.value)}/>
                            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>Discard</Button>
                            <Button onClick={handleSaveProfile}>Save</Button>
                        </DialogContent>
                    </Dialog>
                </>

            </aside>

            {/* Right Content with Tabs */}
            <main className="w-3/4 p-6 flex flex-col">
                {/* Tab Headers */}
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        className={`pb-2 ${activeTab === 'background' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('background')}
                    >
                        About Company
                    </button>
                    <button
                        className={`pb-2 ${activeTab === 'additional-users' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('additional-users')}
                    >
                        Manage Collaborators
                    </button>
                    <button
                        className={`pb-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>


                {/* Tab Content */}
                {activeTab === 'background' && (
                    <div className="flex flex-col w-full max-w-2xl">
                        {successMessage && (
                            <Alert variant="default"
                                   className="mb-6 border-green-500 bg-green-50 text-green-700 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600"/>
                                <AlertTitle className="font-semibold">Success</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        {errors.general && (
                            <p className="text-red-600 mb-4">{errors.general[0]}</p>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label htmlFor="organisation" className='text-neutral30'>Name of your
                                    organisation</Label>
                                <Input
                                    id="organisation"
                                    value={organisation}
                                    onChange={(e) => setOrganisation(e.target.value)}
                                    className="border border-neutral80 "
                                />
                                {getError('organization_name') && (
                                    <p className="text-sm text-red-500">{getError('organization_name')}</p>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label htmlFor="companyUrl" className='text-neutral30'>Company website URL</Label>
                                <Input
                                    id="companyUrl"
                                    type="url"
                                    value={companyUrl}
                                    onChange={(e) => setCompanyUrl(e.target.value)}
                                    className="border border-neutral80"
                                />
                                {getError('website_url') && (
                                    <p className="text-sm text-red-500">{getError('website_url')}</p>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label className='text-neutral30'> Industry or sector</Label>
                                <Select value={industry} onValueChange={setIndustry}>
                                    <SelectTrigger className="border border-neutral80"><SelectValue
                                        placeholder="Select industry"/></SelectTrigger>
                                    <SelectContent>
                                        {industryOptions.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getError('industry_sector') && (
                                    <p className="text-sm text-red-500">{getError('industry_sector')}</p>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label className='text-neutral30'>Annual revenue</Label>
                                <Select value={annualRevenue} onValueChange={setAnnualRevenue} className="bg-white">
                                    <SelectTrigger className="border border-neutral70"><SelectValue
                                        placeholder="Select revenue"/></SelectTrigger>
                                    <SelectContent>
                                        {annualRevenueOptions.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getError('annual_revenue') && (
                                    <p className="text-sm text-red-500">{getError('annual_revenue')}</p>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label className='text-neutral30'>Country</Label>
                                <Select value={country} onValueChange={setCountry}>
                                    <SelectTrigger className="border border-neutral70"><SelectValue
                                        placeholder="Select country"/></SelectTrigger>
                                    <SelectContent>
                                        {countryOptions.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getError('country') && (
                                    <p className="text-sm text-red-500">{getError('country')}</p>
                                )}
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label className='text-neutral30'>Market position</Label>
                                <Select value={marketPosition} onValueChange={setMarketPosition}>
                                    <SelectTrigger className="border border-neutral70"><SelectValue
                                        placeholder="Select position"/></SelectTrigger>
                                    <SelectContent>
                                        {marketPositionOptions.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getError('market_position') && (
                                    <p className="text-sm text-red-500">{getError('market_position')}</p>
                                )}
                            </div>
                            <div className="flex justify-end ">
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Next'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'additional-users' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Collaborators</h2>
                        <table className="min-w-full bg-white border">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">First Name</th>
                                <th className="py-2 px-4 border">Last Name</th>
                                <th className="py-2 px-4 border">Last Updated</th>
                                <th className="py-2 px-4 border">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="text-center">
                                        <td className="py-2 px-4 border">{user.first_name}</td>
                                        <td className="py-2 px-4 border">{user.last_name}</td>
                                        <td className="py-2 px-4 border">
                                            {new Date(user.updated_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {user.email_verified_at ? 'Active' : 'Inactive'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-2 px-4 border text-center">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="flex flex-col gap-6 max-w-md">
                        {settingsSuccessMessage && (
                            <Alert variant="default"
                                   className="mb-6 border-green-500 bg-green-50 text-green-700 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600"/>
                                <AlertTitle className="font-semibold">Success</AlertTitle>
                                <AlertDescription>{settingsSuccessMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div>
                            <Label>Email</Label>
                            <p className="mt-1">{user?.email}</p>
                            <Dialog open={isEmailDialogOpen} className="top-[50%]" onOpenChange={(open) => {
                                setEmailDialogOpen(open);
                                if (!open) {
                                    setNewEmail("");
                                    setConfirmnewEmail("");
                                    setEmailError("");
                                }
                            }}>
                                <DialogTrigger asChild><Button variant="outline" className="mt-2">Update Email</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Update Email</DialogTitle>
                                    <label>Email Address*</label>
                                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
                                    <label>Email Address*</label>
                                    <Input type="email" value={ConfirmnewEmail} onChange={e => setConfirmnewEmail(e.target.value)}/>
                                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                    <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Discard</Button>
                                    <Button onClick={handleUpdateEmail}>Save</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Label>Password</Label>
                            <p className="mt-1">********</p>

                            <Dialog open={isPasswordDialogOpen} className="top-[50%]" onOpenChange={(open) => {
                                setPasswordDialogOpen(open);
                                if (!open) {
                                    setStep(1); // Reset step when dialog closes
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setPasswordError("");
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="mt-2">Update Password</Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogTitle>Update Password</DialogTitle>
                                    {step === 1 && (
                                        <div className="space-y-2">
                                            <label>Current Password*</label>
                                            <Input
                                                type="password"
                                                placeholder="Current Password"
                                                value={currentPassword}
                                                onChange={e => setCurrentPassword(e.target.value)}
                                            />
                                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                                            <Button onClick={handleNextStep} className="mt-2">Next</Button>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-2">
                                            <label>New Password*</label>
                                            <Input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                            />
                                            <label>Confirm New Password*</label>
                                            <Input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                                            <div className="flex justify-between mt-4">
                                                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
                                                <Button onClick={handleUpdatePassword}>Save Changes</Button>
                                            </div>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}