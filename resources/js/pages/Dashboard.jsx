import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { getUser } from "@/components/api/dashboard";
import { getUserFromSession } from "@/components/api/auth";
import { fetchAssessment } from '@/components/api/assessment';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      
      const userData = getUserFromSession();
      if (userData) {
        setUser(userData);
      } else {
        setUser({ name: "Guest" });
        setError(true);
      }

      try {
        const response = await fetchAssessment();
        if (response?.code === 200 && response?.data) {
          setAssessment(response.data);
        } else {
          setAssessment(null);
        }
      } catch (err) {
        setAssessment(null);
        setError(true);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome, {user?.name || "User"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email || "Not available"}</p>
            {user?.phone && <p>Phone: {user.phone}</p>}
            {user?.address && <p>Address: {user.address}</p>}
            <Button asChild>
              <Link to="/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Assessments */}
         <Card>
          <CardHeader>
            <CardTitle>Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {assessment ? (
              <>
                <p>Organization Name: {assessment.organization_name}</p>
                <p>Industry Sector: {assessment.industry_sector}</p>
                <p>Annual Revenue: {assessment.annual_revenue}</p>
                <p>Country: {assessment.country}</p>
                <p>Market Position: {assessment.market_position}</p>
                <p>Created At: {new Date(assessment.created_at).toLocaleString()}</p>
              </>
            ) : (
              <p className="text-muted-foreground">
                No assessment data available.{" "}
                <Link to="/assessment-form" className="text-primary underline">
                  Create your first assessment
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

