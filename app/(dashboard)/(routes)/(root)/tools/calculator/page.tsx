"use client";

import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { evaluate } from "mathjs";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [error, setError] = useState("");
  const displayRef = useRef<HTMLDivElement>(null);

  const buttons = [
    "C", "⌫", "(", ")",
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "√", "^", "π", "e",
    "sin", "cos", "tan", "log",
  ];

  // Helper to insert function around last number/expression
  const wrapLast = (func: string) => {
    // Find last number/expression
    const match = display.match(/([0-9.]+|\([^\(\)]+\))$/);
    if (match) {
      const last = match[0];
      const start = display.slice(0, -last.length);
      return `${start}${func}(${last})`;
    }
    return `${func}(${display})`;
  };

  const handleButtonClick = (value: string) => {
    setError("");
    try {
      if (value === "=") {
        const expr = display
          .replace(/π/g, Math.PI.toString())
          .replace(/e/g, Math.E.toString())
          .replace(/√/g, "sqrt");
        const result = evaluate(expr);
        setDisplay(result.toString());
      } else if (value === "C") {
        setDisplay("0");
      } else if (value === "⌫") {
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      } else if (value === "√") {
        setDisplay(wrapLast("sqrt"));
      } else if (["sin", "cos", "tan", "log"].includes(value)) {
        setDisplay(wrapLast(value));
      } else {
        setDisplay(display === "0" ? value : display + value);
      }
    } catch {
      setError("Invalid Expression");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Handle manual editing
  const handleDisplayInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText.replace(/\n/g, "");
    setDisplay(text || "0");
  };

  // Keep display in sync with state
  const handleDisplayBlur = () => {
    if (displayRef.current) {
      displayRef.current.innerText = display;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between bg-indigo-600 text-white p-4">
          <Link href="/tools" className="p-2 hover:bg-indigo-500 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Smart Calculator</h1>
          <div className="w-5 h-5" /> {/* Spacer */}
        </div>

        {/* Display */}
        <div className="bg-slate-50 px-4 py-6">
          <div
            ref={displayRef}
            className="bg-white text-right text-2xl font-mono px-4 py-3 border rounded-md shadow-inner min-h-[60px] text-gray-800 outline-none"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={handleDisplayInput}
            onBlur={handleDisplayBlur}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleButtonClick("=");
              }
            }}
          >
            {display}
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3 px-4 py-5 bg-white">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`rounded-md py-3 font-semibold text-md transition-all shadow-sm hover:shadow-md
                ${
                  btn === "="
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : btn === "C" || btn === "⌫"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : ["sin", "cos", "tan", "log", "√", "^", "π", "e"].includes(btn)
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }
              `}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
