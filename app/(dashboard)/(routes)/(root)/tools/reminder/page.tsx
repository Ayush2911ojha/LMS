"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Simple Toast component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
            {message}
        </div>
    );
}

export default function ReminderPage() {
    const [reminders, setReminders] = useState([]);
    const [toast, setToast] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchTodayReminders = async () => {
            try {
                const res = await axios.get("/api/reminder/today");
                setReminders(res.data);
            } catch (error) {
                console.error("Failed to fetch today's reminders", error);
            }
        };
        fetchTodayReminders();
    }, []);

    const handleCreate = async () => {
        try {
            await axios.post("/api/reminder", { title, note, date });
            setToast("Reminder added!");
            setTitle("");
            setNote("");
            setDate("");
            // Refresh reminders
            const res = await axios.get("/api/reminder/today");
            setReminders(res.data);
        } catch (error) {
            console.error("Failed to add reminder", error);
            setToast("Failed to add reminder");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10 relative border-2 border-blue-200">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/tools")}
                    className="absolute top-6 left-6 text-base text-blue-700 underline font-semibold"
                >
                    ← Back to Tools
                </button>

                <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-800 tracking-tight">
                    Set a Reminder
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Form */}
                    <div className="flex-1 space-y-6">
                        <input
                            type="text"
                            placeholder="Reminder Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <textarea
                            placeholder="Note (optional)"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                        />
                        {/* Calendar always open */}
                        <div>
                            <label className="block text-blue-700 font-semibold mb-2 text-lg">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                style={{ minHeight: "56px" }}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full bg-blue-700 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition"
                        >
                            Add Reminder
                        </button>
                    </div>
                    {/* Today's Reminders */}
                    <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-inner min-h-[260px]">
                        <strong className="block font-bold text-blue-800 text-xl mb-3">
                            Today’s Reminder(s)
                        </strong>
                        {reminders.length === 0 ? (
                            <div className="text-blue-400 text-base">No reminders for today.</div>
                        ) : (
                            <ul className="list-disc list-inside text-blue-900 space-y-2 text-base">
                                {reminders.map((rem: any) => (
                                    <li key={rem.id}>
                                        <span className="font-semibold">{rem.title}</span>
                                        {rem.note && <>: {rem.note}</>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {/* Toast animation */}
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-fade-in {
                    animation: fade-in 0.3s;
                }
            `}</style>
        </div>
    );
}
