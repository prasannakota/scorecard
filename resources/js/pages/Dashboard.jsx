import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { getUser, getRecentAssessments } from "@/components/api/dashboard";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        setUser({ name: "Guest" }); 
        setError(true);
      }

      try {
        const assessmentsData = await getRecentAssessments();
        setAssessments(assessmentsData);
      } catch (err) {
        setAssessments([]);
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
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <p className="text-muted-foreground">
                No assessments yet.{" "}
                <Link to="/assessment-form" className="text-primary underline">
                  Create your first assessment
                </Link>
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Title</th>
                        <th className="text-left">Score</th>
                        <th className="text-left">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a) => (
                        <tr key={a.id} className="border-t">
                          <td>{a.title}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded h-2">
                                <div
                                  className={`h-2 rounded ${a.score >= 70 ? "bg-green-500" : a.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                  style={{ width: `${a.score}%` }}
                                />
                              </div>
                              <span>{a.score}%</span>
                            </div>
                          </td>
                          <td>{new Date(a.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button asChild>
                    <Link to="/assessments">View All Assessments</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

