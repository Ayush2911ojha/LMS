"use client"
import { useState } from "react"
import Link from "next/link"
// @ts-ignore
import html2pdf from "html2pdf.js"
// @ts-ignore
import mammoth from "mammoth/mammoth.browser"

export default function FileToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError(null)
    }
  }

  const generateContent = async () => {
    try {
      const container = document.createElement("div")
      container.style.width = "100%"
      container.style.backgroundColor = "#fff"
      container.style.padding = "20px"
      container.style.fontFamily = "Arial, sans-serif"
      container.style.boxSizing = "border-box"

      for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase()

        if (ext?.match(/jpg|jpeg|png|webp|gif/)) {
          const img = document.createElement("img")
          const url = URL.createObjectURL(file)
          img.src = url
          img.style.width = "100%"
          img.style.maxWidth = "100%"
          img.style.marginBottom = "20px"
          img.style.borderRadius = "8px"
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`))
          })
          container.appendChild(img)
        } else if (ext === "docx") {
          try {
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.convertToHtml({ arrayBuffer })
            const docDiv = document.createElement("div")
            docDiv.innerHTML = result.value
            docDiv.style.margin = "20px"
            docDiv.style.lineHeight = "1.6"
            docDiv.style.fontSize = "16px"
            container.appendChild(docDiv)
          } catch (err) {
            console.error(`Error processing DOCX ${file.name}:`, err)
            const para = document.createElement("p")
            para.innerText = `⚠️ Error processing ${file.name}: ${
              typeof err === "object" && err !== null && "message" in err
                ? (err as { message?: string }).message
                : "Unknown error"
            }`
            para.style.margin = "20px"
            para.style.color = "#e53e3e"
            container.appendChild(para)
          }
        } else {
          const para = document.createElement("p")
          para.innerText = `📄 ${file.name} (Preview not supported)`
          para.style.margin = "20px"
          para.style.fontSize = "18px"
          para.style.color = "#555"
          container.appendChild(para)
        }
      }
      return container
    } catch (err) {
      console.error("Error generating content:", err)
      setError(
        `Failed to generate content: ${
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : "Unknown error"
        }`
      )
      return null
    }
  }

  const generatePDF = async () => {
    setLoading(true)
    setError(null)
    try {
      const container = await generateContent()
      if (!container) {
        setError("Failed to generate PDF content.")
        setLoading(false)
        return
      }
      await html2pdf()
        .set({
          margin: 10,
          filename: "converted.pdf",
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "pt", format: "a4" },
        })
        .from(container)
        .save()
    } catch (err) {
      console.error("PDF generation error:", err)
      setError(
        "Failed to generate PDF: " +
          (typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : "Unknown error")
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
        href="/tools"
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
        >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tools
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">📁 File to PDF Converter</h1>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-3">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
        </svg>
        <span>
        Supported formats: <b>.jpg, .jpeg, .png, .gif, .webp, .docx</b>. <br className="sm:hidden" />
        You can select multiple files. Images will be shown as previews, DOCX files will be converted to PDF text.
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
        </div>
      )}

      {/* File Input */}
      <label className="block mb-8">
        <span className="block mb-2 text-gray-700 font-medium">Select files to convert:</span>
        <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.docx"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-3 file:px-6
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          file:hover:bg-blue-700 file:transition file:cursor-pointer"
        />
      </label>

      {/* File Previews */}
      {files.length > 0 && (
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {files.map((file, idx) => {
          const ext = file.name.split(".").pop()?.toLowerCase()
          const isImage = ext?.match(/jpg|jpeg|png|webp|gif/)
          return (
            <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition duration-300 relative"
            >
            {isImage ? (
              <img
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="h-48 flex flex-col justify-center items-center bg-gray-100 rounded-lg mb-3">
              <p className="text-4xl">📄</p>
              <p className="text-xs text-gray-600 mt-2">{file.name}</p>
              </div>
            )}
            <p className="text-sm text-gray-700 truncate">{file.name}</p>
            <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
              {ext?.toUpperCase()}
            </span>
            </div>
          )
          })}
        </div>
        {/* Clear Files Button */}
        <div className="flex gap-4 mb-4">
          <button
          onClick={() => setFiles([])}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
          >
          Clear Files
          </button>
        </div>
        </div>
      )}

      {/* Action Button */}
      {files.length > 0 && (
        <div className="flex gap-4">
        <button
          onClick={generatePDF}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
            </svg>
            Processing...
          </span>
          ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Download PDF
          </span>
          )}
        </button>
        </div>
      )}
      </div>
    </div>
  )
}