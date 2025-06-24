"use client";
import Link from "next/link";

import { 

LucideCheckSquare, 
LucideFileText, 
LucideFileBadge, 
LucideCalculator, 
LucideCalendar 
} from "lucide-react";

const tools = [
{ name: "TODO", path: "/tools/todos", icon: <LucideCheckSquare color="#2563eb" size={32} /> },
{ name: "PDF Converter", path: "/tools/pdf-converter", icon: <LucideFileBadge color="#e11d48" size={32} /> },
{ name: "Resume Builder", path: "/tools/resume-builder", icon: <LucideFileText color="#a21caf" size={32} /> },
{ name: "Calculator", path: "/tools/calculator", icon: <LucideCalculator color="#059669" size={32} /> },
{ name: "Calender Based Task Reminder", path: "/tools/reminder", icon: <LucideCalendar color="#f59e42" size={32} /> },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">📚 Student Toolkit</h1>
        <p className="text-gray-600 text-lg">Boost your productivity with these smart tools designed for you!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.path}
            className="group bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-all duration-200 border hover:shadow-xl"
          >
            <div className="text-4xl">{tool.icon}</div>
            <div className="text-lg font-semibold text-gray-700 group-hover:text-blue-700">
              {tool.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
