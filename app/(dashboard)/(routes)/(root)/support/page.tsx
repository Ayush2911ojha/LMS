"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mail, AlertCircle, Book, CreditCard, Bug, MessageSquare } from "lucide-react";

const sections = [
  {
    title: "Course & Lecture Issues",
    icon: <Book className="text-indigo-800 w-6 h-6" />,
    description: "Facing trouble with lectures not playing, video buffering, or content missing?",
  },
  {
    title: "Payment / Purchase Support",
    icon: <CreditCard className="text-indigo-800 w-6 h-6" />,
    description: "Need help with payment failure, refund, or invoice generation?",
  },
  {
    title: "Doubts & Academic Questions",
    icon: <MessageSquare className="text-indigo-800 w-6 h-6" />,
    description: "Have doubts in a course topic or need extra clarification?",
  },
  {
    title: "App / Technical Issues",
    icon: <Bug className="text-indigo-800 w-6 h-6" />,
    description: "Is the app not working properly? Facing bugs or errors?",
  },
  {
    title: "Contact Us / Raise Ticket",
    icon: <AlertCircle className="text-indigo-800 w-6 h-6" />,
    description: "Couldn’t find your issue above? Raise a custom support request.",
  },
];

export default function HelpSupportPage() {
  const [form, setForm] = useState({ email: "", message: "", category: "" });

  const handleSubmit = (category: string) => {
    if (!form.email || !form.message) return alert("Please fill in all fields");
    alert(`✅ Issue submitted under "${category}"\n\n(This is a demo. No real backend).`);
    setForm({ email: "", message: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ⚠️ Demo Note */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow mb-8 text-sm">
          <strong>⚠️ Note:</strong> This Help & Support section is currently in demo mode.
          Backend support, real-time chat, and ticket system will be added later.
        </div>

        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-10">
          Help & Support Center
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <Card key={idx} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h2 className="text-lg font-semibold text-indigo-900">{section.title}</h2>
                </div>
                <p className="text-gray-600 text-sm">{section.description}</p>

                <div className="space-y-3">
                  <Input
                    placeholder="Your email"
                    value={form.category === section.title ? form.email : ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value, category: section.title })
                    }
                  />
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    rows={3}
                    value={form.category === section.title ? form.message : ""}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value, category: section.title })
                    }
                  />
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 w-full"
                    onClick={() => handleSubmit(section.title)}
                  >
                    Submit Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
