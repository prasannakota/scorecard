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
    updateProfile
} from '@/components/api/assessment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AssessmentForm() {
    const navigate = useNavigate();

    // State
    const [organisation, setOrganisation] = useState('');
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
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

    const [industryOptions, setIndustryOptions] = useState([]);
    const [annualRevenueOptions, setAnnualRevenueOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [marketPositionOptions, setMarketPositionOptions] = useState([]);

    const [activeTab, setActiveTab] = useState('background'); // background | additional-users

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
            setUser(response.data);
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
    }, []);


    useEffect(() => {
        if (user?.name) {
            setNewName(user.name);
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

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    aria-label="Back to Dashboard"
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-semibold">
                    Background
                    <span className="text-sm text-gray-500 font-normal ml-2">
                        Total Questions: 6
                      </span>
                </h1>
            </header>
            <p>A few quick answers will enable us to better support your assessment journey.</p>
            <div className="flex flex-col w-full max-w-2xl">
                {successMessage && (
                    <Alert variant="default" className="mb-6 border-green-500 bg-green-50 text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <AlertTitle className="font-semibold">Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                {errors.general && (
                    <p className="text-red-600 mb-4">{errors.general[0]}</p>
                )}

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <Label htmlFor="organisation">Name of your Organisation</Label>
                        <Input
                            id="organisation"
                            value={organisation}
                            onChange={(e) => setOrganisation(e.target.value)}
                        />
                        {getError('organization_name') && (
                            <p className="text-sm text-red-500">{getError('organization_name')}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="companyUrl">What is your company website(URL)</Label>
                        <Input
                            id="companyUrl"
                            type="url"
                            value={companyUrl}
                            onChange={(e) => setCompanyUrl(e.target.value)}
                        />
                        {getError('website_url') && (
                            <p className="text-sm text-red-500">{getError('website_url')}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label>Which industry or sector do you primarily operate in?</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
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
                    <div className="mb-4">
                        <Label>What is you annual total revenue?</Label>
                        <Select value={annualRevenue} onValueChange={setAnnualRevenue}>
                            <SelectTrigger><SelectValue placeholder="Select revenue" /></SelectTrigger>
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
                    <div className="mb-4">
                        <Label>What country do you operate from?</Label>
                        <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
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
                    <div className="mb-4">
                        <Label>How are you positioned in the market?</Label>
                        <Select value={marketPosition} onValueChange={setMarketPosition}>
                            <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
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
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Next'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}