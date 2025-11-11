import React, { useState } from "react";
import { GraduationCap, BookOpen, Shield, Loader2 } from "lucide-react";
import { User } from "../App"; // Import the User interface
import { Alert, AlertDescription } from "./ui/alert"; // Assuming you have an Alert component

interface LoginProps {
  onLoginSuccess: (user: User) => void; // Changed prop
}

type Role = "student" | "instructor" | "admin";

export default function Login({ onLoginSuccess }: LoginProps) {
  const [loading, setLoading] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: Role) => {
    setLoading(role);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: role }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed.');
      }

      // On success, pass the full user object up
      onLoginSuccess(data.user);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred.');
      setLoading(null);
    }
    // No need to setLoading(null) on success, as the component will unmount
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center transition-all hover:shadow-2xl">
        <div className="flex justify-center mb-4">
          <GraduationCap className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">LearnHub Pro</h1>
        <p className="text-gray-600 mb-8">Select your role to continue</p>

        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-900">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleLogin("student")}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading === 'student' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <BookOpen className="w-5 h-5" />
            )}
            Student
          </button>

          <button
            onClick={() => handleLogin("instructor")}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading === 'instructor' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <GraduationCap className="w-5 h-5" />
            )}
            Instructor
          </button>

          <button
            onClick={() => handleLogin("admin")}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
          >
            {loading === 'admin' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
            Admin
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8">© 2025 LearnHub Pro</p>
      </div>
    </div>
  );
}