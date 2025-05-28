import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const optionColors = [
  'bg-red-500 text-white',
  'bg-rose-300 text-black',
  'bg-purple-500 text-white',
  'bg-green-300 text-black',
  'bg-green-700 text-white',
];

export default function QuestionCard({
  currentQuestion,
  currentIndex,
  handleAnswer,
  selectedOption,
  questions,
  setCurrentIndex,
  answers,
  setSelectedOption,
}) {
  return (
    <Card className="p-4">
      <div className="font-semibold mb-4">
        Question {currentIndex + 1}: {currentQuestion.question_text}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {['a', 'b', 'c', 'd', 'e'].map((opt, i) => {
          const optionKey = `option_${opt}`;
          const scoreKey = `score_${opt}`;
          const isSelected = selectedOption === opt; 

          const circleColor = optionColors[i] || 'bg-gray-400 text-white';

          return (
            <div
              key={opt}
              onClick={() => handleAnswer(opt, currentQuestion[scoreKey])} 
              className={`flex items-center gap-3 cursor-pointer select-none ${
                isSelected ? 'font-bold' : 'font-normal'
              }`}
            >
              <div
                className={`${circleColor} flex items-center justify-center rounded-full w-7 h-7 flex-shrink-0 ${
                  isSelected ? 'font-bold scale-110' : ''
                }`}
              >
                {opt}
              </div>
              <span>{currentQuestion[optionKey]}</span>
            </div>
          );
        })}

        <div className="flex gap-4 mt-4 justify-end">
          {currentIndex > 0 && (
            <Button
              onClick={() => {
                setCurrentIndex((prev) => prev - 1);
                const prevAnswer = answers.find(
                  (a) => a.question_id === questions[currentIndex - 1].id
                );
                setSelectedOption(prevAnswer?.selected_option || null);
              }}
            >
              Prev
            </Button>
          )}

          <Button
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                const nextAnswer = answers.find(
                  (a) => a.question_id === questions[currentIndex + 1].id
                );
                setSelectedOption(nextAnswer?.selected_option || null);
              }
            }}
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              handleAnswer(null, 0);
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                const nextAnswer = answers.find(
                  (a) => a.question_id === questions[currentIndex + 1].id
                );
                setSelectedOption(nextAnswer?.selected_option || null);
              }
            }}
          >
            Skip
          </Button>
        </div>
      </div>
    </Card>
  );
}
