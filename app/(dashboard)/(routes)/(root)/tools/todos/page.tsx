"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ApiTodo {
  id: string;
  task: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

export default function TodosPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [todos, setTodos] = useState<ApiTodo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user) fetchTodos();
    else setTodos([]);
  }, [isSignedIn, user]);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await axios.get<ApiTodo[]>("/api/todos");
      setTodos(res.data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.details || "Failed to fetch todos.");
    }
    setLoading(false);
  }

  async function addTodo() {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post<ApiTodo>("/api/todos", { task: newTask.trim() });
      setTodos((prev) => [...prev, res.data]);
      setNewTask("");
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.details || "Failed to add todo.");
    }
    setLoading(false);
  }

  async function toggleTodoComplete(id: string, completed: boolean) {
    const originalTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
    );
    try {
      const res = await axios.put<ApiTodo>("/api/todos", { id, completed: !completed });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? res.data : todo)));
    } catch (error: any) {
      setTodos(originalTodos);
      setError(error.response?.data?.details || "Failed to update status.");
    }
  }

  async function deleteTodo(id: string) {
    const originalTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    try {
      await axios.delete("/api/todos", { data: { id } });
    } catch (error: any) {
      setTodos(originalTodos);
      setError(error.response?.data?.details || "Failed to delete todo.");
    }
  }

  async function updateTodoText(id: string, task: string) {
    setLoading(true);
    try {
      const res = await axios.put<ApiTodo>("/api/todos", { id, completed: false });
      await axios.delete("/api/todos", { data: { id } });
      const newRes = await axios.post<ApiTodo>("/api/todos", { task });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? newRes.data : todo)));
      setEditTaskId(null);
      setEditTaskText("");
    } catch (error: any) {
      setError("Failed to update task text");
    }
    setLoading(false);
  }

  if (!isSignedIn) {
    return <p className="text-center mt-20 text-gray-600 text-lg">Please login to see your todos.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
        <button
          onClick={() => router.push("/tools")}
          className="absolute left-4 top-4 text-blue-600 font-medium hover:underline text-sm"
        >
          ← Back to Tools
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="inline-block">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2" />
            <path d="M7 9h.01M7 13h.01M12 9h5M12 13h5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Your To-Do List
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
          <button
            onClick={addTodo}
            disabled={loading || !newTask.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-400">No tasks yet. Add your first task above.</p>
        ) : (
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {todos.map(({ id, task, completed }) => (
              <li
                key={id}
                className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition group"
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => toggleTodoComplete(id, completed)}
                  className="w-5 h-5 accent-blue-600"
                />
                {editTaskId === id ? (
                  <input
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    onBlur={() => updateTodoText(id, editTaskText)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateTodoText(id, editTaskText);
                      if (e.key === "Escape") {
                        setEditTaskId(null);
                        setEditTaskText("");
                      }
                    }}
                    autoFocus
                    className="flex-grow bg-transparent border-b border-gray-400 text-sm focus:outline-none"
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setEditTaskId(id);
                      setEditTaskText(task);
                    }}
                    className={`flex-grow text-sm select-none ${
                      completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {task}
                  </span>
                )}
                <button
                  onClick={() => deleteTodo(id)}
                  className="text-red-500 text-xs font-medium hover:text-red-700 transition opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
