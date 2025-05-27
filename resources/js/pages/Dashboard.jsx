import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { getUserFromSession } from "@/components/api/auth";
import { fetchAssessment, getAssessmentStatus } from "@/components/api/assessment";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = getUserFromSession();
        setUser(userData || { name: "Guest" });

        const assessmentResponse = await fetchAssessment();
        if (assessmentResponse?.code === 200 && assessmentResponse?.data) {
          setAssessment(assessmentResponse.data);
        } else {
          setAssessment(null);
        }
        const statusResponse = await getAssessmentStatus();
        setAssessmentStatus(statusResponse || null);
      } catch (err) {
        setAssessment(null);
        setAssessmentStatus(null);
        setError(true);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }
  let actionType = "start"; 

  if (assessmentStatus && assessmentStatus.departments && assessmentStatus.departments !== "") {
    if (assessmentStatus.total_score === 0) {
      actionType = "continue";
    } else {
      actionType = "download";
    }
  }
  const renderActionButton = () => {
    if (actionType === "start") {
      return (
        <Button asChild>
          <Link to={`/department`}>
            Start Assessment
          </Link>
        </Button>
      );
    } else if (actionType === "continue") {
      return (
        <Button asChild>
          <Link to={`/assessment/start?departments=${assessmentStatus.departments}&assessment_id=${assessmentStatus.assessment_id}`}>
            Continue Assessment
          </Link>
        </Button>
      );
    } else if (actionType === "download") {
      return (
        <Button asChild>
          <Link to={`/result`}>
            Download Result
          </Link>
        </Button>
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome, {user?.name || "User"}
      </h2>

      <Card className="w-full ">
        <CardHeader>
          <CardTitle>
            {actionType === "start" && "Commerce Scorecard: Unlock Insight. Drive Growth"}
            {actionType === "continue" && "Your business is developing it's strengths."}
            {actionType === "download" && "Your business is developing it's strengths."}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!assessment && (
            <p className="text-muted-foreground">
              No assessment data available.{" "}
              <Link to="/assessment-form" className="text-primary underline">
                Create your first assessment
              </Link>
            </p>
          )}

          {assessment && actionType === "start" && (
            <>
               <p>The commerce scorecard is your personalised report card, design to highlight stengths, reveal blind spot.</p>
            </>
          )}

          {assessment && actionType === "continue" && (
            <p>You are on your way to building a high-performing e-commerce business. Sales and logistics are strong but your marketing strategy has room to grow.</p>
          )}

          {assessment && actionType === "download" && (
            <p>You are on your way to building a high-performing e-commerce business. Sales and logistics are strong but your marketing strategy has room to grow.</p>
          )}

          <div className="mt-4">{renderActionButton()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
