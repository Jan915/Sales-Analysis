import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Student interfaces
export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  enrollment_date: string;
  grade_level?: string;
  gpa: number;
  status: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  courses?: Course[];
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  description?: string;
  credits: number;
  instructor?: string;
  semester?: string;
  year?: number;
  grade?: string;
  enrollment_date?: string;
  completion_status?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  enrollmentThisMonth: number;
  averageGPA: string;
  recentEnrollments: number;
}

export interface PaginationResponse<T> {
  students: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStudents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Student API functions
export const studentAPI = {
  // Get all students with pagination and search
  getStudents: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get<PaginationResponse<Student>>('/students', { params }),

  // Get single student
  getStudent: (id: number) => api.get<Student>(`/students/${id}`),

  // Create student
  createStudent: (data: FormData) => api.post<{ message: string; student: Student }>('/students', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Update student
  updateStudent: (id: number, data: FormData) => api.put<{ message: string }>(`/students/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Delete student
  deleteStudent: (id: number) => api.delete<{ message: string }>(`/students/${id}`),

  // Enroll student in course
  enrollInCourse: (studentId: number, courseId: number) => 
    api.post<{ message: string }>(`/students/${studentId}/courses`, { course_id: courseId }),

  // Update student grade
  updateGrade: (studentId: number, courseId: number, grade: string, status?: string) =>
    api.put<{ message: string }>(`/students/${studentId}/courses/${courseId}`, { 
      grade, 
      completion_status: status 
    }),

  // Get student statistics
  getStudentStats: (id: number) => api.get<{
    totalCourses: number;
    averageGrade: string;
    attendanceRate: string;
    totalClasses: number;
  }>(`/students/${id}/stats`),
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),

  // Get recent students
  getRecentStudents: () => api.get<Student[]>('/dashboard/recent-students'),

  // Get enrollment trends
  getEnrollmentTrends: () => api.get<{ month: string; count: number }[]>('/dashboard/enrollment-trends'),

  // Get grade distribution
  getGradeDistribution: () => api.get<{ grade_range: string; count: number }[]>('/dashboard/grade-distribution'),

  // Get course enrollments
  getCourseEnrollments: () => api.get<{
    course_name: string;
    course_code: string;
    enrolled_students: number;
    instructor: string;
  }[]>('/dashboard/course-enrollments'),

  // Get top students
  getTopStudents: () => api.get<Student[]>('/dashboard/top-students'),
};

// Auth API functions
export const authAPI = {
  // Login
  login: (username: string, password: string) => 
    api.post<{ message: string; token: string; user: any }>('/auth/login', { username, password }),

  // Verify token
  verify: () => api.get<{ user: any }>('/auth/verify'),

  // Register (if needed)
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post<{ message: string; user: any }>('/auth/register', data),
};

export default api;