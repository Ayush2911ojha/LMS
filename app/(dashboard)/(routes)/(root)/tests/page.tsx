"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const dummyTests = [
  { id: 1, title: "Java Basics Test", total: 20 },
  { id: 2, title: "Data Structures Quiz", total: 15 },
];

const dummyCertificates = [
  "Java Certificate.pdf",
  "DSA Excellence.pdf",
  "Top Performer March.pdf",
];

const dummyLeaderboard = [
  { name: "Rohit", score: 19 },
  { name: "Alex", score: 17 },
  { name: "You", score: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function TestPage() {
  const [results, setResults] = useState<any[]>([]);

  const handleAttempt = (test: { id: number; title: string; total: number }) => {
    const scored = Math.floor(Math.random() * test.total + 1);
    const result = {
      id: test.id,
      title: test.title,
      total: test.total,
      score: scored,
    };
    setResults([result, ...results]);
  };

  const pieData =
    results.length > 0
      ? [
          { name: "You", value: results[0].score },
          { name: "Top Scorer", value: Math.max(...dummyLeaderboard.map(d => d.score)) },
        ]
      : [];

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Demo Note */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded mb-6 shadow-sm">
          <strong>⚠️ Note:</strong> This Test Page is currently in demo mode. Test submissions and results are not stored. Full backend functionality will be added soon.
        </div>

        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Test Center</h1>

        {/* Available Tests */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Available Tests</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {dummyTests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-indigo-900">{test.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">Total Marks: {test.total}</p>
                  <Button onClick={() => handleAttempt(test)}>Attempt Test</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Results */}
        {results.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Your Results</h2>
            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="p-2 text-left">Test</th>
                  <th className="p-2 text-left">Score</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.score}</td>
                    <td className="p-2">{r.total}</td>
                    <td className="p-2">{((r.score / r.total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Leaderboard */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Leaderboard</h2>
          <ul className="bg-white shadow rounded divide-y">
            {dummyLeaderboard.map((user, index) => (
              <li key={index} className="p-3 flex justify-between text-indigo-700">
                <span>{user.name}</span>
                <span>{user.score} marks</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Comparison Chart</h2>
            <div className="flex justify-center">
              <PieChart width={300} height={250}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </section>
        )}

        {/* Certificates */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Your Certificates</h2>
          <ul className="bg-white shadow rounded divide-y">
            {dummyCertificates.map((cert, index) => (
              <li key={index} className="p-3 flex justify-between items-center">
                <span className="text-indigo-700">{cert}</span>
                <Button variant="outline" size="sm">Download</Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
