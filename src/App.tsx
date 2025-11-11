import { useState } from "react";
import { StudentDashboard } from "./components/StudentDashboard";
import { InstructorDashboard } from "./components/InstructorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { CourseViewer } from "./components/CourseViewer";
import Login from "./components/login"; // 👈 New login component
import "./App.css";

export default function App() {
  const [userRole, setUserRole] = useState<
    "student" | "instructor" | "admin" | null
  >(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  // 🟣 STEP 1: Show the Login page first
  if (!userRole) {
    return <Login onSelectRole={setUserRole} />;
  }

  // 🟢 STEP 2: If student opens a course, show Course Viewer
  if (activeCourse && userRole === "student") {
    return (
      <CourseViewer
        courseId={activeCourse}
        onBack={() => setActiveCourse(null)}
      />
    );
  }

  // 🔵 STEP 3: Show the appropriate dashboard after login
  if (userRole === "student") {
    return <StudentDashboard onEnrollCourse={setActiveCourse} />;
  }

  if (userRole === "instructor") {
    return <InstructorDashboard />;
  }

  if (userRole === "admin") {
    return <AdminDashboard />;
  }

  return null;
}
