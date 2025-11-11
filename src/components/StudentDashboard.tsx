import React, { useState, useEffect } from 'react';
import { User } from '../App'; // Import User type
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onEnrollCourse: (courseId: string) => void;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    username: string;
  };
}

export function StudentDashboard({ user, onEnrollCourse }: StudentDashboardProps) {
  const [dashboardData, setDashboardData] = useState<{ message: string; courses: Course[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard?role=student`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch dashboard data.');
        }

        setDashboardData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Runs once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p className="text-xl text-gray-700 mb-8">{dashboardData?.message}</p>
      
      <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData?.courses.map((course) => (
          <Card key={course._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>Taught by: {course.instructor.username}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{course.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onEnrollCourse(course._id)}
              >
                Enroll Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}