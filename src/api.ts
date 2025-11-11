// src/api.ts
// This file centralizes all API calls to the backend

export const API_BASE_URL = "http://localhost:5000";

/**
 * A helper function for making authenticated fetch requests.
 * We'll add token logic here later if needed.
 */
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Add this line when you have JWT auth
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error or invalid JSON response' }));
    throw new Error(errorData.message || 'An unknown API error occurred');
  }
  
  // Handle empty responses (e.g., from a 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// --- Auth ---
export const loginUser = (role: string) => {
  return apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
};

// --- Dashboards ---
export const getDashboardData = (role: string, userId: string) => {
  return apiFetch(`/api/dashboard?role=${role}&userId=${userId}`);
};

// --- Courses ---
export const getAllCourses = () => {
  return apiFetch('/api/courses');
};

export const getCourseById = (courseId: string) => {
  return apiFetch(`/api/courses/${courseId}`);
};

export const createCourse = (courseData: { title: string; description: string; instructor: string }) => {
  return apiFetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = (courseId: string, courseData: any) => {
  return apiFetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
};

// --- Enrollment ---
export const enrollInCourse = (studentId: string, courseId: string) => {
  return apiFetch('/api/enroll', {
    method: 'POST',
    body: JSON.stringify({ studentId, courseId }),
  });
};

// --- File Upload ---
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    // Note: Do NOT set 'Content-Type' header for FormData, 
    // the browser sets it automatically with the correct boundary
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'File upload failed' }));
    throw new Error(errorData.message || 'An unknown file upload error occurred');
  }
  return response.json();
};

// --- Assignments & Submissions ---
export const getAssignmentsForCourse = (courseId: string) => {
  return apiFetch(`/api/assignments/course/${courseId}`);
};

export const submitAssignment = async (assignmentId: string, studentId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assignmentId', assignmentId);
  formData.append('studentId', studentId);

  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Submission failed' }));
    throw new Error(errorData.message || 'An unknown submission error occurred');
  }
  return response.json();
};

// --- Discussion Forum ---
export const getThreads = (courseId: string) => {
  return apiFetch(`/api/forum/threads/${courseId}`);
};

export const createThread = (data: { course: string; author: string; title: string; content: string }) => {
  return apiFetch('/api/forum/threads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPosts = (threadId: string) => {
  return apiFetch(`/api/forum/posts/${threadId}`);
};

export const createPost = (data: { thread: string; author: string; content: string }) => {
  return apiFetch('/api/forum/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// --- Refunds ---
export const requestRefund = (data: { student: string; course: string; reason: string }) => {
  return apiFetch('/api/refunds/request', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPendingRefunds = () => {
  return apiFetch('/api/refunds/pending');
};

export const manageRefund = (requestId: string, status: 'approved' | 'rejected') => {
  return apiFetch(`/api/refunds/manage/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// --- Analytics ---
export const getAdminAnalytics = () => {
  return apiFetch('/api/analytics/admin');
};