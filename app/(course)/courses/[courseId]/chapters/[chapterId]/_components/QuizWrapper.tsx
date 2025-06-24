"use client";

import React, { useState } from "react";
import { Lock as LockIcon } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

interface QuizWrapperProps {
  quizQuestions: QuizQuestion[];
  courseProgressPercent: number;
}

function QuizModal({
  questions,
  onClose,
}: {
  questions: QuizQuestion[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  function handleOptionClick() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quiz completed!");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p className="mb-6">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              className="w-full py-2 bg-blue-100 hover:bg-blue-200 rounded"
              onClick={handleOptionClick}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="mt-4 text-sm text-gray-500 underline"
          onClick={onClose}
        >
          Close Quiz
        </button>
      </div>
    </div>
  );
}

export function QuizWrapper({ quizQuestions, courseProgressPercent }: QuizWrapperProps) {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto my-6 px-4">
        <button
          disabled={courseProgressPercent !== 100}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            courseProgressPercent === 100
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          } flex items-center justify-center space-x-2`}
          onClick={() => setQuizOpen(true)}
        >
          <span>Take Quiz</span>
          {courseProgressPercent !== 100 && (
            <LockIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {quizOpen && (
        <QuizModal
          questions={quizQuestions}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </>
  );
}
