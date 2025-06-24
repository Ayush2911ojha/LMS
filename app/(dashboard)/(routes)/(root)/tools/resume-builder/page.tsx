"use client";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DroppableStateSnapshot,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import jsPDF from "jspdf";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Item = {
  id: string;
  content: string;
};

type Section = {
  id: string;
  title: string;
  items: Item[];
};

function generateId(prefix: string) {
  return prefix + "-" + Math.random().toString(36).substring(2, 9);
}

const defaultSections: Section[] = [
  {
    id: "experience",
    title: "Experience",
    items: [{ id: generateId("exp"), content: "" }],
  },
  {
    id: "education",
    title: "Education",
    items: [{ id: generateId("edu"), content: "" }],
  },
  {
    id: "skills",
    title: "Skills",
    items: [{ id: generateId("skill"), content: "" }],
  },
];

const ResumeMaker = () => {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [resumeData, setResumeData] = useState<Section[] | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    const newSections = Array.from(sections);
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);

    setSections(newSections);
  };

  const updateItemContent = (
    sectionIndex: number,
    itemIndex: number,
    newContent: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex].content = newContent;
    setSections(newSections);
  };

  const addItem = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.push({
      id: generateId(newSections[sectionIndex].id),
      content: "",
    });
    setSections(newSections);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResumeData(sections);
  };

  // Download resume as PDF
  const downloadPDF = () => {
    if (!resumeData) return;

    const doc = new jsPDF();

    let y = 10;
    doc.setFontSize(18);
    doc.text("Resume", 105, y, { align: "center" });
    y += 15;

    doc.setFontSize(14);
    resumeData.forEach((section) => {
      doc.setFont( "bold");
      doc.text(section.title, 10, y);
      y += 8;
      doc.setFont( "normal");

      section.items.forEach((item) => {
        const text = item.content.trim() || "(No details provided)";
        // split text if too long for line
        const splitText = doc.splitTextToSize(text, 180);
        doc.text("- " + splitText.join("\n- "), 15, y);
        y += splitText.length * 7;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });

      y += 10;
    });

    doc.save("resume.pdf");
    };
    

  return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-2xl">
        <div className="flex items-center mb-6">
          <Link href="/tools" className="p-2 hover:bg-indigo-500 hover:text-white rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-3xl font-bold ml-4 text-indigo-700">Advanced Resume Maker</h2>
        </div>

        <div className="mb-8 p-4 bg-indigo-100 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2 text-indigo-800">Tips for a Great Resume</h3>
          <ul className="list-disc list-inside text-indigo-700 space-y-1 text-sm">
            <li>Keep your descriptions concise and achievement-focused.</li>
            <li>Use action verbs (e.g., Led, Developed, Managed, Improved).</li>
            <li>Highlight quantifiable results where possible.</li>
            <li>Tailor your resume for the job you want.</li>
            <li>Proofread for spelling and grammar errors.</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections" direction="vertical">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.map((section, sectionIndex) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={sectionIndex}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border-2 rounded-xl p-6 mb-6 bg-white shadow-md transition ${
                            snapshot.isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-indigo-800">{section.title}</h3>
                            <span {...provided.dragHandleProps} className="cursor-move text-indigo-400 hover:text-indigo-700">
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <circle cx="7" cy="7" r="2" fill="currentColor"/>
                                <circle cx="7" cy="12" r="2" fill="currentColor"/>
                                <circle cx="7" cy="17" r="2" fill="currentColor"/>
                                <circle cx="17" cy="7" r="2" fill="currentColor"/>
                                <circle cx="17" cy="12" r="2" fill="currentColor"/>
                                <circle cx="17" cy="17" r="2" fill="currentColor"/>
                              </svg>
                            </span>
                          </div>
                          {section.items.map((item, itemIndex) => (
                            <textarea
                              key={item.id}
                              placeholder={`Enter ${section.title} details`}
                              className="border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 mb-3 w-full resize-y rounded-lg bg-indigo-50 text-gray-800 transition"
                              value={item.content}
                              rows={section.title === "Skills" ? 2 : 3}
                              onChange={(e) =>
                                updateItemContent(
                                  sectionIndex,
                                  itemIndex,
                                  e.target.value
                                )
                              }
                            />
                          ))}

                          <button
                            type="button"
                            onClick={() => addItem(sectionIndex)}
                            className="text-indigo-600 hover:underline text-sm font-medium mt-1"
                          >
                            + Add {section.title} item
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow transition"
            >
              Generate Resume
            </button>
          </div>
        </form>

        {/* Extra: Example Phrases and Guidance */}
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
          <h4 className="font-semibold text-yellow-700 mb-1">Need inspiration?</h4>
          <p className="text-yellow-800 text-sm mb-2">Try these example phrases:</p>
          <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
            <li>Developed and maintained web applications using React and Node.js.</li>
            <li>Managed a team of 5 to deliver projects on time and within budget.</li>
            <li>Increased sales by 20% through targeted marketing campaigns.</li>
            <li>Proficient in JavaScript, TypeScript, and Python.</li>
            <li>Bachelor of Science in Computer Science, XYZ University.</li>
          </ul>
        </div>

        {resumeData && (
          <div className="mt-12 p-8 border-2 border-indigo-200 rounded-2xl bg-indigo-50 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Your Resume Preview</h2>
            {resumeData.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-indigo-800">{section.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      {item.content.trim() || <em className="text-gray-400">(No details provided)</em>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              onClick={downloadPDF}
              className="mt-6 bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 shadow transition"
            >
              Download Resume as PDF
            </button>
          </div>
        )}
      </div>
  );
};

export default ResumeMaker;
