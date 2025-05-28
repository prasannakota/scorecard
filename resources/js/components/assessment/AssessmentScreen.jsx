  import React, { useEffect, useState } from 'react';
  import { fetchDepartments, fetchQuestionsByDepartments, submitAnswer, startAssessment, fetchAnswersByAssessmentId, updateScore } from '@/components/api/assessment';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { ArrowLeft, AlertCircle, ChevronLeft, ChevronRight, Diamond } from 'lucide-react';
  import { Card, CardContent } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { ProgressCircle } from '@/components/ui/progress-circle';
  import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
  import { Link } from 'react-router-dom';
  import QuestionCard from './QuestionCard';
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

  export default function AssessmentScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [assessmentId, setAssessmentId] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
    const [showPendingQuestions, setShowPendingQuestions] = useState(false);
    const [pendingQuestions, setPendingQuestions] = useState([]);


    const query = new URLSearchParams(location.search);
    const departmentIdsFromUrl = query.get('departments')?.split(',').map(Number) || [];
    const assessmentIdFromUrl = query.get('assessment_id');

    useEffect(() => {
      setAssessmentId(assessmentIdFromUrl);
      fetchDepartments()
        .then((allDepts) => {
          const validDepartments = allDepts.filter((dept) => dept.questions_count > 0);
          setDepartments(validDepartments);
          setSelectedDepartments(departmentIdsFromUrl.filter(id => validDepartments.some(d => d.id === id)));
        })
        .catch((err) => console.error("Fetch Departments Error:", err));
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        if (selectedDepartments.length > 0) {
          try {
            const data = await fetchQuestionsByDepartments(selectedDepartments);
            setQuestions(data.questions);

            const assessmentAnswers = await fetchAnswersByAssessmentId(assessmentIdFromUrl);
            console.log(assessmentAnswers, 'assessmentAnswers');

            if (assessmentAnswers && assessmentAnswers.length > 0) {
              const formattedAnswers = assessmentAnswers.map(ans => ({
                assessment_id: String(ans.assessment_id),
                question_id: ans.question_id,
                department_id: ans.department_id,
                selected_option: ans.selected_option,
                score: ans.score,
              }));
              setAnswers(formattedAnswers);
              setSelectedOption(formattedAnswers[0].selected_option);
            } else {
              setAnswers([]);  // Set empty array if no answers found
              setSelectedOption(null);
            }
            setCurrentIndex(0);
            
          } catch (err) {
            console.error("Fetch Questions Error:", err);
          }
        } else {
          setQuestions([]);
          setAnswers([]); 
        }
      };

      fetchData();
    }, [selectedDepartments, assessmentIdFromUrl]);


    const handleShowPending = () => {
      const unanswered = questions.filter(
        (q) => !answers.some((a) => a.question_id === q.id)
      );
      setPendingQuestions(unanswered);
      setShowPendingQuestions(true);
      // Show the first pending question
      if (unanswered.length > 0) {
        const firstPendingIndex = questions.findIndex(q => q.id === unanswered[0].id);
        setCurrentIndex(firstPendingIndex);
        const firstPendingAnswer = answers.find(a => a.question_id === unanswered[0].id);
        setSelectedOption(firstPendingAnswer?.selected_option || null);
      }
    };


    const toggleDepartment = async (id) => {
      let updatedDepartments;
      setSelectedDepartments((prev) => {
        updatedDepartments = prev.includes(id) ? prev.filter((deptId) => deptId !== id) : [...prev, id];
        return updatedDepartments;
      });
      try {
        const result = await startAssessment(updatedDepartments);
        console.log(result.message);
        setAssessmentId(result.assessment_id);
      } catch (error) {
        console.error('Error updating assessment:', error);
      }
    };

    const currentQuestion = questions[currentIndex];
    const currentDept = departments.find((d) => d.id === currentQuestion?.department_id);

    const handleAnswer = (option, score) => {
      if (!currentQuestion) return;

      const answerPayload = {
        assessment_id: assessmentId,
        question_id: currentQuestion.id,
        department_id: currentQuestion.department_id,
        selected_option: option,  
        score,
      };

      submitAnswer(answerPayload)
        .then((res) => {
          console.log('answers',answers);
          console.log('Answer submitted successfully:', res);
        })
        .catch((err) => {
          console.error('Error submitting answer:', err);
        });

      setAnswers((prev) => {
        const existingIndex = prev.findIndex((a) => a.question_id === currentQuestion.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = answerPayload;
          return updated;
        } else {
          return [...prev, answerPayload];
        }
      });
      console.log('answers',answers);
      setSelectedOption(option);
    };

    const percentage = questions.length > 0 ? Math.round((answers.length / questions.length) * 100) : 0;
    const pending = questions.length - answers.length;

    const goToNext = () => {
      console.log('answers',answers);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        const nextAnswer = answers.find(a => a.question_id === questions[currentIndex + 1].id);
        
        setSelectedOption(nextAnswer?.selected_option || null);
      }
    };

    const goToPrev = () => {
      console.log('answers',answers);
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        const prevAnswer = answers.find(a => a.question_id === questions[currentIndex - 1].id);
        setSelectedOption(prevAnswer?.selected_option || null);
        console.log('answers',answers);
      }
    };

   useEffect(() => {
    const updateAssessmentScore = async () => {
      try {
        if (assessmentId) {
          await updateScore(assessmentId, 100); 
          console.log('Score updated to 100');
        }
      } catch (error) {
        console.error('Error updating score:', error);
      }
    };

    if (percentage === 100 && pending === 0) {
      setShowSuccessPopup(true);
      updateAssessmentScore(); 
      const timer = setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }, [percentage, pending, assessmentId]);

    const handleSaveExit = async () => {
    try {
      setShowSubmitSuccess(true);
      setTimeout(() => {
        setShowSubmitSuccess(false);
        navigate('/dashboard'); 
      }, 3000);
    } catch (error) {
      console.error('Error during save & exit:', error);
    }
  };


    return (
      <div className="flex min-h-screen">
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">Assessment Completed!</h3>
            <p>Congratulations, you have successfully completed the assessment.</p>
          </div>
        </div>
      )}

      {showSubmitSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">Success!</h3>
            <p>Your assessment has been submitted successfully.</p>
            <p className="mt-2 text-sm text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      )}


        <div className="flex-1 p-6 space-y-6">
          <header className="flex items-center justify-between p-2">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} aria-label="Back to Dashboard">
                <ArrowLeft className="w-6 h-6" />
              </button>

              <ProgressCircle percentage={percentage} />

              <h2 className="text-lg font-semibold">{currentDept?.name || 'Select a Department'}</h2>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle size={16} className="text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white text-xs rounded p-1">
                    {currentDept?.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right side - Grey box with pending questions */}
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md">
              <AlertCircle size={16} className="text-gray-500" />
              <span>
                {pending} pending questions to finish the assessment
              </span>
              
              <button
                onClick={handleShowPending}
                className="text-blue-600 hover:underline ml-2 bg-transparent border-none cursor-pointer"
              >
                Complete
              </button>

            </div>
          </header>

          {showPendingQuestions && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-900 rounded">
              Showing only pending questions. Please complete these first.
              <button
                className="ml-4 text-blue-600 underline"
                onClick={() => setShowPendingQuestions(false)}
              >
                Show All Questions
              </button>
            </div>
          )}

          <div className="flex justify-end items-center text-sm text-gray-700 px-2 font-semibold">
            <Link to="/department?fromAssessment=1" className="text-blue-600 underline">
              Select Departments
            </Link>
          </div>

          {/* Departments Row */}
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-400">
            {departments.map((dept) => {
              const isSelected = selectedDepartments.includes(dept.id);
              return (
                <Card
                  key={dept.id}
                  onClick={() => toggleDepartment(dept.id)}
                  className={`cursor-pointer p-4 border rounded-lg min-w-48 flex-shrink-0 transition-colors duration-200 ${
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

          {/* Question Section */}
          {currentQuestion ? (
            <QuestionCard
              currentQuestion={currentQuestion}
              currentIndex={currentIndex}
              handleAnswer={handleAnswer}
              selectedOption={selectedOption}
              questions={questions}
              setCurrentIndex={setCurrentIndex}
              answers={answers}
              setSelectedOption={setSelectedOption}
            />
          ) : (
            <div className="text-center mt-10">
              <p>{selectedDepartments.length > 0 ? 'All questions completed!' : 'Please select a department.'}</p>
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={`transition-all duration-300 bg-gray-100 border-l border-gray-300 ${sidebarVisible ? 'w-64 p-4' : 'w-12 p-2'}`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <button onClick={() => setSidebarVisible((prev) => !prev)} className="mb-4">
                {sidebarVisible ? <ChevronRight /> : <ChevronLeft />}
              </button>

              {sidebarVisible && (
                <>
                  <div className="flex flex-col text-lg mb-4">
                    <span>Overall Status:</span>
                    <span className="inline-block mt-1 text-sm bg-green-600 text-white px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <div className="flex justify-center my-6">
                    <ProgressCircle percentage={percentage} size={100} />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Diamond className="text-purple-900" />
                    <span>Woho! You're {percentage}% in__ Keep going, success is just around the corner</span>
                  </div>
                </>
              )}
            </div>
            {sidebarVisible && (
                <Button variant="outline" className="mt-8 w-full" onClick={handleSaveExit}>
                  Save & Exit
                </Button>
              )}
          </div>
        </div>
      </div>
    );
  }
