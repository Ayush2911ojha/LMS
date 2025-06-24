"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctOption: string
}

interface QuizSectionProps {
  quizQuestions: QuizQuestion[]
  isCompleted: boolean
}

export const QuizSection = ({ quizQuestions, isCompleted }: QuizSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(quizQuestions.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)

  if (isCompleted) {
    return <p className="text-center font-semibold text-lg mt-6">You have completed this course. Quiz is not available.</p>
  }

  const handleAnswer = (option: string) => {
    if (showResult) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = option
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    let correct = 0
    quizQuestions.forEach((q, i) => {
      if (answers[i] === q.correctOption) correct++
    })
    return correct
  }

  const totalCorrect = calculateScore()
  const totalWrong = quizQuestions.length - totalCorrect

  const chartData = [
    { name: "Correct", value: totalCorrect },
    { name: "Wrong", value: totalWrong },
  ]

  const COLORS = ["#22c55e", "#ef4444"]
  const currentQuestion = quizQuestions[currentIndex]

  return (
    <div
      className="
        w-full
        max-w-2xl
        min-w-[320px]
        mx-auto
        p-6
        bg-white
        shadow-md
        rounded-lg
        mt-6
        min-h-[600px]
        transition-all
        duration-300
        sm:px-8
        "
      style={{ boxSizing: "border-box" }}
    >
      <p className="font-semibold text-xl mb-4 text-center">Quiz Section</p>

      {!showResult && (
        <div className="min-h-[350px] flex flex-col">
          <p className="font-medium text-lg mb-2">
            Question {currentIndex + 1} / {quizQuestions.length}
          </p>
          <p className="mb-4 text-gray-700 font-semibold text-base bg-blue-50 p-3 rounded">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 gap-3 flex-grow">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt}
                className={`
                  cursor-pointer
                  p-3
                  border
                  rounded-lg
                  transition-all
                  duration-200
                  flex
                  items-center
                  ${
                    showResult && opt === currentQuestion.correctOption ? "bg-green-100 font-bold" : ""
                  }
                  ${
                    showResult && answers[currentIndex] === opt && opt !== currentQuestion.correctOption ? "bg-red-100" : ""
                  }
                  ${
                    answers[currentIndex] === opt ? "border-blue-500" : "border-gray-300"
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  checked={answers[currentIndex] === opt}
                  disabled={showResult}
                  onChange={() => handleAnswer(opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              Previous
            </Button>

            {currentIndex < quizQuestions.length - 1 && (
              <Button
                disabled={answers[currentIndex] === null}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next
              </Button>
            )}

            {currentIndex === quizQuestions.length - 1 && !showResult && (
              <Button
                disabled={answers.includes(null)}
                onClick={() => setShowResult(true)}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      )}

      {showResult && !reviewMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">Quiz Report</h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center md:ml-8 mt-6 md:mt-0">
              <p className="text-xl font-semibold">Total Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalCorrect * 2} / {quizQuestions.length * 2}
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button onClick={() => {
              setReviewMode(true)
              setCurrentIndex(0)
            }}>
              Review Answers
            </Button>
          </div>
        </div>
      )}

      {showResult && reviewMode && (
        <div className="mt-8">
          <p className="font-medium text-lg mb-2">
            Question {currentIndex + 1} / {quizQuestions.length}
          </p>
          <p className="mb-4 text-gray-700 font-semibold text-base bg-blue-50 p-3 rounded">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt) => (
              <div
                key={opt}
                className={`p-3 border rounded-lg ${
                  opt === currentQuestion.correctOption ? "bg-green-100 font-bold" : ""
                } ${
                  answers[currentIndex] === opt && opt !== currentQuestion.correctOption ? "bg-red-100" : ""
                }`}
              >
                {opt}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              Previous
            </Button>

            <Button
              disabled={currentIndex === quizQuestions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizSection
