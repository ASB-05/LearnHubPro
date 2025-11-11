// src/App.tsx
import React, { useState } from "react";
import Login from "./components/login";
import { StudentDashboard } from "./components/StudentDashboard";
import { InstructorDashboard } from "./components/InstructorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import ChatWidget from "./components/ChatWidget";
import "./App.css";

// Define a User type
export interface User {
  id: string;
  username: string;
  role: "student" | "instructor" | "admin";
}

export default function App() {
  // State now holds the entire User object or null
  const [user, setUser] = useState<User | null>(null);

  const renderDashboard = () => {
    if (!user) return null; // Guard clause

    if (user.role === "student") {
      return <StudentDashboard user={user} onEnrollCourse={(courseId: string) => {
        console.log("Enrolling in course:", courseId);
        // Implement enrollment logic here
      }} />;
    } else if (user.role === "instructor") {
      return <InstructorDashboard user={user} />;
    } else if (user.role === "admin") {
      return <AdminDashboard user={user} />;
    }
    return null;
  };

  return (
    <>
      {user ? renderDashboard() : <Login onLoginSuccess={setUser} />}
      
      {/* Pass the full user object to the ChatWidget */}
      {user && <ChatWidget user={user} />}
    </>
  );
}