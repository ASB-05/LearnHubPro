import React from "react";
import { GraduationCap, BookOpen, Shield, User } from "lucide-react";

interface LoginProps {
  onSelectRole: (role: "student" | "instructor" | "admin") => void;
}

export default function Login({ onSelectRole }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center transition-all hover:shadow-2xl">
        <div className="flex justify-center mb-4">
          <GraduationCap className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">LearnHub Pro</h1>
        <p className="text-gray-600 mb-8">Select your role to continue</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelectRole("student")}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <BookOpen className="w-5 h-5" /> Student
          </button>

          <button
            onClick={() => onSelectRole("instructor")}
            className="flex items-center justify-center gap-3 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            <GraduationCap className="w-5 h-5" /> Instructor
          </button>

          <button
            onClick={() => onSelectRole("admin")}
            className="flex items-center justify-center gap-3 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            <Shield className="w-5 h-5" /> Admin
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8">© 2025 LearnHub Pro</p>
      </div>
    </div>
  );
}
