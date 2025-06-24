"use client";

import { useState, useMemo } from "react";

type Student = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
};

export default function StudentsPage() {
  const initialStudents: Student[] = [
    { id: 1, name: "Rohit Sharma", email: "roh@example.com", status: "Active" },
    { id: 2, name: "Neha Singh", email: "neha@example.com", status: "Inactive" },
    { id: 3, name: "Amit Kumar", email: "amit@example.com", status: "Active" },
    { id: 4, name: "Pooja Verma", email: "pooja@example.com", status: "Inactive" },
    { id: 5, name: "Suresh Reddy", email: "suresh@example.com", status: "Active" },
    { id: 6, name: "Anita Joshi", email: "anita@example.com", status: "Inactive" },
    { id: 7, name: "Karan Singh", email: "karan@example.com", status: "Active" },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Sort filtered students
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents].sort((a, b) => {
      let comp = 0;
      if (sortKey === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortKey === "status") {
        comp = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? comp : -comp;
    });
    return sorted;
  }, [filteredStudents, sortKey, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return sortedStudents.slice(start, start + studentsPerPage);
  }, [sortedStudents, currentPage]);

  // Handlers
  const toggleSort = (key: "name" | "status") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Students</h1>

          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert("Add Student functionality coming soon!")}
          >
            + Add New Student
          </button>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search students by name or email..."
            className="w-full sm:w-96 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2 items-center text-gray-700 select-none">
            <span>Sort by:</span>
            <button
              onClick={() => toggleSort("name")}
              className={`px-3 py-1 rounded-md border ${
                sortKey === "name"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              aria-label="Sort by name"
            >
              Name {sortKey === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              onClick={() => toggleSort("status")}
              className={`px-3 py-1 rounded-md border ${
                sortKey === "status"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              aria-label="Sort by status"
            >
              Status {sortKey === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
        </div>

        <table className="w-full table-auto border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="py-3 px-4 border-b border-gray-300">Name</th>
              <th className="py-3 px-4 border-b border-gray-300">Email</th>
              <th className="py-3 px-4 border-b border-gray-300">Status</th>
              <th className="py-3 px-4 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">{student.name}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{student.email}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        student.status === "Active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {student.status === "Active" ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      )}
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:underline mr-4"
                      onClick={() => alert(`Edit ${student.name} functionality coming soon!`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => alert(`Delete ${student.name} functionality coming soon!`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="mt-6 flex justify-center items-center gap-3 text-gray-700 select-none">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 1
                ? "cursor-not-allowed text-gray-400 border-gray-300"
                : "hover:bg-gray-100 border-gray-400"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage === totalPages
                ? "cursor-not-allowed text-gray-400 border-gray-300"
                : "hover:bg-gray-100 border-gray-400"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-sm italic">
          * This is a demo page. Functionalities like search, sorting, pagination, add, edit,
          and delete are partially implemented or planned for future updates.
        </p>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
          <h3 className="font-semibold mb-2">Future Planned Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Full CRUD operations with backend integration</li>
            <li>Real-time updates and WebSocket support for multi-user collaboration</li>
            <li>Role-based access control (e.g., teachers, admins)</li>
            <li>Bulk actions: Delete multiple students, change status in bulk</li>
            <li>Student profile pages with detailed info and analytics</li>
            <li>Import/export students data (CSV, Excel)</li>
            <li>Better UI modals for Add/Edit student forms</li>
            <li>Advanced search filters and pagination on backend</li>
            <li>Notification system for student status changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
