// src/App.tsx
import React, { useState } from "react";
import Login from "./components/login"; //
import {StudentDashboard} from "./components/StudentDashboard"; //
import {InstructorDashboard }from "./components/InstructorDashboard"; //
import {AdminDashboard} from "./components/AdminDashboard"; //
import ChatWidget from "./components/ChatWidget"; // 👈 ** IMPORT NEW COMPONENT **
import "./App.css"; //

export default function App() {
  const [userRole, setUserRole] = useState<
    "student" | "instructor" | "admin" | null
  >(null);

  const renderDashboard = () => {
    if (userRole === "student") {
      return <StudentDashboard onEnrollCourse={function (courseId: string): void {
        throw new Error("Function not implemented.");
      } } />;
    } else if (userRole === "instructor") {
      return <InstructorDashboard />;
    } else if (userRole === "admin") {
      return <AdminDashboard />;
    }
    return null;
  };

  return (
    <>
      {userRole ? renderDashboard() : <Login onSelectRole={setUserRole} />}
      
      {/* 👈 ** RENDER CHAT WIDGET HERE ** */}
      {/* This will render the widget as long as a user is logged in */}
      {userRole && <ChatWidget />}
    </>
  );
}