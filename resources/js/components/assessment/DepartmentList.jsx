import React, { useEffect, useState } from 'react';
import { fetchDepartments, startAssessment, getAssessmentStatus } from '@/components/api/assessment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [minRequired, setMinRequired] = useState(5); 
  const navigate = useNavigate();
   const location = useLocation();
  const fromAssessment = new URLSearchParams(location.search).get('fromAssessment');

  useEffect(() => {
    const checkAssessment = async () => {
      try {
        const result = await getAssessmentStatus();

        if (result && result.assessment_id) {
          const selected = result.departments ? result.departments.split(',').map((id) => parseInt(id)) : [];

          if (fromAssessment) {
            setSelectedIds(selected);
            const data = await fetchDepartments();
            const validDepartments = data.filter((dept) => dept.questions_count > 0);
            setDepartments(validDepartments);

            const total = validDepartments.length;
            if (total > 5) {
              setMinRequired(5);
            } else if (total <= 5 && total > 1) {
              setMinRequired(total - 1);
            } else {
              setMinRequired(total);
            }
          } else {
            navigate(`/assessment/start?departments=${result.departments}&assessment_id=${result.assessment_id}`);
          }
        } else {
          const data = await fetchDepartments();
          const validDepartments = data.filter((dept) => dept.questions_count > 0);
          setDepartments(validDepartments);

          const total = validDepartments.length;
          if (total > 5) {
            setMinRequired(5);
          } else if (total <= 5 && total > 1) {
            setMinRequired(total - 1);
          } else {
            setMinRequired(total);
          }
        }
      } catch (error) {
        console.error('Error checking assessment:', error);
      }
    };

    checkAssessment();
  }, [fromAssessment, navigate]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((deptId) => deptId !== id) : [...prev, id]
    );
  };

  const startAssessmentHandler = async () => {
    if (selectedIds.length < minRequired) return;

    try {
      const result = await startAssessment(selectedIds);
      const { assessment_id } = result;
      navigate(`/assessment/start?departments=${selectedIds.join(',')}&assessment_id=${assessment_id}`);
    } catch (error) {
      console.error('Error starting assessment:', error);
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
          Select Key Department
          <span className="text-sm text-gray-500 font-normal ml-2">
            Total Modules: {departments.length}
          </span>
        </h1>
      </header>

      {departments.length === 0 ? (
        <p>No available departments with questions at this time.</p>
      ) : (
        <>
          <p>
            Please select all departments that are important to your organisation's strategic focus areas over the next 12 months.
            <br />You must select at least {minRequired} module{minRequired > 1 ? 's' : ''} to proceed.
          </p>

          <Alert variant="info">
            <AlertCircle size={16} className="text-blue-500" /> 
            <AlertDescription>
              Your selection will determine which functional activities you'll be asked to assess in the next section. You can also select or add more departments during the assessment.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {departments.map((dept) => {
              const isSelected = selectedIds.includes(dept.id);
              return (
                <Card
                  key={dept.id}
                  onClick={() => toggleSelection(dept.id)}
                  className={`cursor-pointer p-4 border rounded-lg transition-colors duration-200 ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CardContent className="p-0 w-full">
                    <div className="font-semibold">{dept.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Questions: {dept.questions_count}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-right">
            <Button
              disabled={selectedIds.length < minRequired}
              onClick={startAssessmentHandler}
            >
              Start Assessment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
