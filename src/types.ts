export type UserRole = "patient" | "specialist" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  lifeCategory?: string; // special child parent, first-time mother, single parent, corporate employee, student, etc.
  languagePreference: "en" | "bn";
  role: UserRole;
  registrationDate: string;
  avatarUrl?: string;
  status: "active" | "suspended" | "banned";
}

export interface Specialist {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  rating: number;
  reviewsCount: number;
  availabilityStatus: "available" | "unavailable";
  fees: number;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  rating: number;
  modulesCount: number;
  enrolledCount: number;
  coverUrl: string;
  isPremium?: boolean;
  price?: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  contentType: "video" | "audio" | "text";
  contentUrl: string;
}

export interface Enrollment {
  id: string;
  patientId: string;
  courseId: string;
  enrollmentDate: string;
  status: "active" | "completed";
  completionRate: number; // 0 to 100
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  deadline: string;
  instructions: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  patientId: string;
  uploadedFile?: string;
  observation: string;
  submissionTime: string;
  status: "submitted" | "reviewed";
  assignmentTitle?: string;
  patientName?: string;
}

export interface Feedback {
  id: string;
  submissionId: string;
  specialistId: string;
  feedbackText: string;
  ratingScore: number;
  createdAt: string;
  specialistName?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  specialistId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "approved" | "cancelled" | "completed";
  fees: number;
  sessionNotes?: string;
  meetingLink?: string;
  patientName?: string;
  specialistName?: string;
}

export interface CommunityPost {
  id: string;
  patientId: string;
  patientName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  status: "active" | "flagged" | "hidden";
  reportsCount: number;
}

export interface CommunityResponse {
  id: string;
  postId: string;
  responderId: string;
  responderName: string;
  responderRole: UserRole;
  replyText: string;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  urgencyLevel: "medium" | "high" | "critical";
  status: "unresolved" | "in_progress" | "resolved";
  createdAt: string;
  notes?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "successful" | "failed" | "cancelled";
  date: string;
  description: string;
}

export interface Notification {
  id: string;
  patientId: string;
  title: string;
  message: string;
  notificationType: "appointment" | "assignment" | "feedback" | "emergency" | "system";
  isRead: boolean;
  sentAt: string;
}

export interface MoodLog {
  id: string;
  patientId: string;
  mood: "serene" | "calm" | "neutral" | "anxious" | "exhausted" | "sad";
  score: number; // 1 to 5
  notes?: string;
  createdAt: string;
}

export interface AssessmentRecord {
  id: string;
  patientId: string;
  score: number;
  category: "mild" | "moderate" | "severe";
  recommendations: string[];
  createdAt: string;
}
