"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import QuizSection from "./QuizSection"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctOption: string
}

interface Props {
  quizQuestions: QuizQuestion[]
  isCompleted: boolean
}

const QuizClientWrapper = ({ quizQuestions, isCompleted }: Props) => {
  const [quizStarted, setQuizStarted] = useState(false)

  if (!isCompleted) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Lock size={16} />
        Complete the course to unlock the quiz
      </Button>
    )
  }

  if (!quizStarted) {
    return <Button onClick={() => setQuizStarted(true)}>Start Quiz</Button>
  }

  return (
    <QuizSection
      quizQuestions={quizQuestions}
      isCompleted={false}
    />
  )
}

export default QuizClientWrapper
