"use client";

import React, { useState } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string; // optional, if you want to show result
}

interface QuizModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export function QuizModal({ questions, onClose }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  function handleOptionClick(option: string) {
    setSelectedOptions([...selectedOptions, option]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // quiz finished
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
              onClick={() => handleOptionClick(opt)}
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
