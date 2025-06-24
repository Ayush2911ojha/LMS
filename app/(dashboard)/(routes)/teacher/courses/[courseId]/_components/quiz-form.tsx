"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import toast from "react-hot-toast"

interface Question {
  question: string
  options: string[]
  correctOption: string
}

interface QuizFormProps {
  courseId: string
}

export const QuizForm = ({ courseId }: QuizFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  })
  const [jsonInput, setJsonInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle option change for manual add
  const handleChange = (index: number, value: string) => {
    const newOptions = [...current.options]
    newOptions[index] = value
    setCurrent({ ...current, options: newOptions })
  }

  // Add manual question
  const addQuestion = () => {
    if (!current.question.trim() || current.options.some(opt => !opt.trim())) {
      toast.error("All fields are required")
      return
    }
    const newQuestion: Question = {
      question: current.question,
      options: current.options,
      correctOption: current.options[current.correctIndex],
    }
    setQuestions([...questions, newQuestion])

    setCurrent({
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    })
  }

  // Save all questions (manual + uploaded)
  const saveQuiz = async () => {
    if (questions.length === 0) {
      toast.error("No questions to save")
      return
    }

    setLoading(true)
    try {
      await axios.post(`/api/courses/${courseId}/quiz`, {
        questions,
      })
      toast.success("Quiz saved successfully")
      setQuestions([])
      setJsonInput("")
    } catch {
      toast.error("Error saving quiz")
    } finally {
      setLoading(false)
    }
  }

  // Handle JSON paste upload
  const handleJsonUpload = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      if (!Array.isArray(parsed)) {
        toast.error("JSON should be an array of questions")
        return
      }
      for (const q of parsed) {
        if (
          typeof q.question !== "string" ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          typeof q.correctOption !== "string"
        ) {
          toast.error("Each question must have a question, 4 options and a correctOption string")
          return
        }
      }
      // Merge parsed questions with existing ones
      setQuestions((prev) => [...prev, ...parsed])
      toast.success("JSON questions added to quiz")
      setJsonInput("")
    } catch {
      toast.error("Invalid JSON format")
    }
  }

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        if (typeof text !== "string") throw new Error("File read error")
        const parsed = JSON.parse(text)
        if (!Array.isArray(parsed)) {
          toast.error("JSON file should contain an array of questions")
          return
        }
        for (const q of parsed) {
          if (
            typeof q.question !== "string" ||
            !Array.isArray(q.options) ||
            q.options.length !== 4 ||
            typeof q.correctOption !== "string"
          ) {
            toast.error("Each question must have a question, 4 options and a correctOption string")
            return
          }
        }
        setQuestions((prev) => [...prev, ...parsed])
        toast.success("Questions added from JSON file")
      } catch {
        toast.error("Invalid JSON file format")
      }
    }
    reader.readAsText(file)
    e.target.value = "" // reset input for same file reupload
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add Quiz Questions Manually</h2>

      <Textarea
        placeholder="Enter question..."
        value={current.question}
        onChange={(e) => setCurrent({ ...current, question: e.target.value })}
      />

      {current.options.map((opt, idx) => (
        <Input
          key={idx}
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => handleChange(idx, e.target.value)}
        />
      ))}

      <div className="space-x-2">
        <label className="text-sm">Correct Option:</label>
        <select
          value={current.correctIndex}
          onChange={(e) =>
            setCurrent({ ...current, correctIndex: Number(e.target.value) })
          }
          className="border rounded px-2 py-1 text-sm"
        >
          {[0, 1, 2, 3].map((idx) => (
            <option key={idx} value={idx}>
              Option {idx + 1}
            </option>
          ))}
        </select>
      </div>

      <Button type="button" onClick={addQuestion}>
        Add Question
      </Button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold">Upload Quiz via JSON</h2>

      <Textarea
        placeholder='Paste JSON array here, e.g. [{"question":"...","options":["..."],"correctOption":"..."}]'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={8}
      />

      <Button
        onClick={handleJsonUpload}
        disabled={loading}
        className="mt-2"
      >
        {loading ? "Processing..." : "Upload JSON Quiz"}
      </Button>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Or Upload JSON File</label>
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </div>

      {questions.length > 0 && (
        <>
          <hr className="my-6" />
          <p className="text-sm text-muted-foreground">
            {questions.length} question(s) ready to save.
          </p>
          <Button
            onClick={saveQuiz}
            disabled={loading}
            className="mt-2 bg-green-600"
          >
            {loading ? "Saving..." : "Save Quiz"}
          </Button>
        </>
      )}
    </div>
  )
}
