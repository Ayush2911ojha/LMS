"use client";

import { useState } from "react";

export default function TeacherSettingsPage() {
  const [name, setName] = useState("Rohit Sharma");
  const [email, setEmail] = useState("rohit@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    alert("Settings saved successfully! (Demo only)");
  };

  const handleDeleteAccount = () => {
    alert("Account deletion requested. (Demo only)");
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`min-h-screen p-8 bg-gradient-to-tr from-indigo-50 to-indigo-100 ${darkMode ? 'bg-gray-900 text-gray-200' : 'text-indigo-900'}`}>
      <div className={`max-w-4xl mx-auto bg-white ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-3xl p-10 border border-indigo-300`}>
        <h1 className={`text-4xl font-extrabold mb-10 tracking-wide ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
          Teacher Settings
        </h1>

        {/* Profile */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Profile Information
          </h2>
          <div className="space-y-6 max-w-md">
            <label className="block">
              <span className="font-medium mb-1 block">Full Name</span>
              <input
                type="text"
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-white border-indigo-300 placeholder-indigo-400 text-indigo-900'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </label>

            <label className="block">
              <span className="font-medium mb-1 block">Email Address</span>
              <input
                type="email"
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-white border-indigo-300 placeholder-indigo-400 text-indigo-900'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </label>
          </div>
        </section>

        {/* Password */}
        <section className="mb-12 max-w-md">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Change Password
          </h2>
          <label className="block mb-5">
            <span className="font-medium mb-1 block">Current Password</span>
            <input
              type="password"
              className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-white border-indigo-300 placeholder-indigo-400 text-indigo-900'}`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <label className="block">
            <span className="font-medium mb-1 block">New Password</span>
            <input
              type="password"
              className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-white border-indigo-300 placeholder-indigo-400 text-indigo-900'}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
        </section>

        {/* Notifications */}
        <section className="mb-12 max-w-md">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Notification Preferences
          </h2>
          <label className="inline-flex items-center cursor-pointer space-x-3">
            <input
              type="checkbox"
              className="form-checkbox h-6 w-6 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <span className="font-medium select-none">
              Enable email notifications
            </span>
          </label>
        </section>

        {/* Language */}
        <section className="mb-12 max-w-md">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Language Preference
          </h2>
          <select
            className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-indigo-300 text-indigo-900'}`}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </section>

        {/* Timezone */}
        <section className="mb-12 max-w-md">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Timezone
          </h2>
          <select
            className={`w-full rounded-lg px-4 py-3 border focus:outline-none shadow-sm focus:ring-4 focus:ring-indigo-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-indigo-300 text-indigo-900'}`}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option>Asia/Kolkata</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
            <option>Asia/Tokyo</option>
          </select>
        </section>

        {/* Dark Mode */}
        <section className="mb-12 max-w-md">
          <h2 className={`text-2xl font-semibold mb-6 border-b-2 border-indigo-400 pb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            Display Mode
          </h2>
          <label className="inline-flex items-center cursor-pointer space-x-3">
            <input
              type="checkbox"
              className="form-checkbox h-6 w-6 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="font-medium select-none">
              Enable Dark Mode
            </span>
          </label>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="block w-full max-w-md mx-auto px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>

        {/* Account Deletion */}
        <section className="max-w-md mt-14 mx-auto text-center">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-800 font-semibold underline"
          >
            Delete Account
          </button>
          {showDeleteConfirm && (
            <div className="mt-4 bg-red-100 border border-red-400 rounded-lg p-5 max-w-md mx-auto text-red-800">
              <p className="mb-4 font-semibold">
                Are you sure you want to delete your account? This action is irreversible.
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleDeleteAccount}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
