import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '@/components/api/assessment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch((error) => console.error('Error fetching departments:', error));
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((deptId) => deptId !== id) : [...prev, id]
    );
  };

  const startAssessment = () => {
    if (selectedIds.length > 0) {
      navigate(`/assessment/start?departments=${selectedIds.join(',')}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
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
            Total Modules: 14
          </span>
        </h1>
      </header>

      {/* Paragraph */}
      <p>
        Please select all departments that are important to your organisation's strategic focus areas over the next 12 months.
        <br />You must select at least 5 modules to proceed.
      </p>

      {/* Warning Alert */}
      <Alert variant="info">
        <AlertTitle>!</AlertTitle>
        <AlertDescription>
          Your selection will determine which functional activities you'll be asked to assess in the next section. You can also select or add more departments during the assessment.
        </AlertDescription>
      </Alert>

      {/* Department Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {departments.map((dept) => {
          const isSelected = selectedIds.includes(dept.id);
          return (
            <Card
              key={dept.id}
              onClick={() => toggleSelection(dept.id)}
              className={`cursor-pointer p-4 border rounded-lg transition-colors duration-200 ${
                isSelected
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 bg-gray-100 hover:border-gray-400'
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

      {/* Start Assessment Button */}
      <div className="text-right">
        <Button
          disabled={selectedIds.length === 0}
          onClick={startAssessment}
        >
          Start Assessment
        </Button>
      </div>
    </div>
  );
}
