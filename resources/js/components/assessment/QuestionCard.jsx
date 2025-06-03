import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Share2, Users } from 'lucide-react';
import ShareQuestionModal from './ShareQuestionModal';
import ShareModuleModal from './ShareModuleModal';

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
  const [showMenu, setShowMenu] = useState(false);
  const [showShareQuestionModal, setShowShareQuestionModal] = useState(false);
  const [showShareModuleModal, setShowShareModuleModal] = useState(false);

  return (
    <Card className="p-4 relative">
      {/* 3-dot action */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-52 bg-white shadow-md rounded p-2 z-20">
            <div className="text-sm font-semibold text-gray-600 px-2 py-1">Share</div>
            <div className="border-t my-1" />

            <div
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
              onClick={() => {
                setShowMenu(false);
                setShowShareQuestionModal(true);
              }}
            >
              <Share2 size={16} />
              <span>Share Question</span>
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
              onClick={() => {
                setShowMenu(false);
                setShowShareModuleModal(true);
              }}
            >
              <Users size={16} />
              <span>Share Module with Team</span>
            </div>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="font-semibold mb-4">
        Question {currentIndex + 1}: {currentQuestion.question_text}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-2">
        {['a', 'b', 'c', 'd', 'e'].map((opt, i) => {
          const optionKey = `option_${opt}`;
          const scoreKey = `score_${opt}`;
          const isSelected = selectedOption === opt;

          const optionColors = [
            'bg-red-500 text-white',
            'bg-rose-300 text-black',
            'bg-purple-500 text-white',
            'bg-green-300 text-black',
            'bg-green-700 text-white',
          ];
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

        {/* Prev/Next/Skip buttons */}
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

      {/* Modals */}
      {showShareQuestionModal && (
        <ShareQuestionModal
          question={currentQuestion}
          onClose={() => setShowShareQuestionModal(false)}
        />
      )}
      {showShareModuleModal && (
        <ShareModuleModal
          question={currentQuestion}
          onClose={() => setShowShareModuleModal(false)}
        />
      )}
    </Card>
  );
}
