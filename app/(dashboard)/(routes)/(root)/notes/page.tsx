"use client";

import { useState, useRef } from "react";

const courses = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
    { id: 3, name: "Fitness" },
    { id: 4, name: "Engineering" },
    { id: 5, name: "Computer Science" },
     { id: 6, name: "Teachnoloy" },
];

export default function StudentNotesPage() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState<
    { id: number; courseId: number; title: string; content: string; type: "text" | "drawing" }[]
  >([]);

  const [mode, setMode] = useState<"text" | "drawing">("text");
  const [isDrawing, setIsDrawing] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing state
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Rich Text commands
  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    textRef.current?.focus();
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.strokeStyle = "#4F46E5"; // Indigo 600
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      lastPos.current = { x: currentX, y: currentY };
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  // Save note (text or drawing)
  const saveNote = () => {
    let content = "";

    if (mode === "text") {
      if (!textRef.current) return alert("Nothing to save!");
      content = textRef.current.innerHTML.trim();
      if (!noteTitle.trim() || !content) {
        return alert("Please enter a title and some note content.");
      }
    } else {
      // Drawing mode - convert canvas to dataURL
      if (!noteTitle.trim()) return alert("Please enter a title.");
      const canvas = canvasRef.current;
      if (!canvas) return;
      content = canvas.toDataURL();
    }

    setNotes([
      { id: Date.now(), courseId: selectedCourse, title: noteTitle.trim(), content, type: mode },
      ...notes,
    ]);

    setNoteTitle("");
    if (mode === "text" && textRef.current) {
      textRef.current.innerHTML = "";
    }
    if (mode === "drawing") {
      clearCanvas();
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          Student Notes & Drawings
        </h1>

        {/* Course select + Title */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            className="flex-1 border border-indigo-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Note / Drawing Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="flex-2 border border-indigo-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center mb-4 space-x-6">
          <button
            onClick={() => setMode("text")}
            className={`px-6 py-2 rounded-md font-semibold ${
              mode === "text"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            Text Notes
          </button>
          <button
            onClick={() => setMode("drawing")}
            className={`px-6 py-2 rounded-md font-semibold ${
              mode === "drawing"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            Drawing Canvas
          </button>
        </div>

        {/* Editor Area */}
        {mode === "text" ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-2 justify-center">
              <button
                type="button"
                onClick={() => execCmd("bold")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                type="button"
                onClick={() => execCmd("italic")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Italic"
              >
                <i>I</i>
              </button>
              <button
                type="button"
                onClick={() => execCmd("underline")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Underline"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => execCmd("insertOrderedList")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Numbered List"
              >
                1.
              </button>
              <button
                type="button"
                onClick={() => execCmd("insertUnorderedList")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => execCmd("formatBlock", "H1")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => execCmd("formatBlock", "H2")}
                className="px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
                title="Heading 2"
              >
                H2
              </button>
            </div>

            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[180px] border border-indigo-400 rounded-md p-4 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              spellCheck={true}
              style={{ whiteSpace: "pre-wrap", position: "relative" }}
            >
              {noteTitle === "" && (!textRef.current || textRef.current.innerText.trim() === "") && (
                <span style={{ color: "#a3a3a3", pointerEvents: "none", position: "absolute" }}>
                  Write your notes here...
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between mb-2 items-center">
              <p className="text-indigo-700 font-semibold">Draw your notes here</p>
              <button
                onClick={clearCanvas}
                className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="border border-indigo-400 rounded-md cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <p className="text-indigo-500 text-sm mt-1">
              Use your mouse/touchpad to draw. Clear to start over.
            </p>
          </>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={saveNote}
            className="px-8 py-3 bg-indigo-700 text-white font-bold rounded shadow hover:bg-indigo-800 transition"
          >
            Save {mode === "text" ? "Note" : "Drawing"}
          </button>
        </div>

        {/* Display saved notes */}
        <div className="mt-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4 text-center">
            Saved Notes & Drawings
          </h2>
          {notes
            .filter((n) => n.courseId === selectedCourse)
            .map((n) => (
              <div
                key={n.id}
                className="border border-indigo-300 rounded-lg p-4 mb-4 bg-indigo-50"
              >
                <h3 className="font-semibold text-indigo-700 text-lg mb-2">{n.title}</h3>
                {n.type === "text" ? (
                  <div
                    className="prose max-w-none text-indigo-900"
                    dangerouslySetInnerHTML={{ __html: n.content }}
                  />
                ) : (
                  <img
                    src={n.content}
                    alt={n.title}
                    className="max-w-full border border-indigo-300 rounded-md"
                  />
                )}
              </div>
            ))}

          {notes.filter((n) => n.courseId === selectedCourse).length === 0 && (
            <p className="text-indigo-600 text-center">No notes or drawings saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
