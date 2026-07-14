import React, { useState, useEffect } from "react";
import { 
  mockUsers, mockSpecialists, mockCourses, mockModules, 
  mockAssignments, initialEnrollments, initialSubmissions, 
  initialFeedbacks, initialAppointments, initialCommunityPosts, 
  initialCommunityResponses, initialNotifications, initialMoodLogs, 
  initialEmergencyRequests 
} from "./mockData";
import { 
  User, Specialist, Course, Enrollment, Submission, 
  Feedback, Appointment, CommunityPost, CommunityResponse, 
  Notification, MoodLog, EmergencyRequest 
} from "./types";

// Import custom modular components
import BreathingExercise from "./components/BreathingExercise";
import Assessment from "./components/Assessment";
import Chatbot from "./components/Chatbot";
import SpecialistDashboard from "./components/SpecialistDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Logo from "./components/Logo";

// Import Firebase Auth, DB and Sync tools
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  FirebaseUser,
  collection,
  doc,
  getDoc,
  onSnapshot
} from "./firebase";
import {
  seedDatabaseIfEmpty,
  saveMoodLogToFirestore,
  saveCommunityPostToFirestore,
  saveCommunityResponseToFirestore,
  saveAppointmentToFirestore,
  saveEnrollmentToFirestore,
  saveSubmissionToFirestore,
  saveFeedbackToFirestore,
  saveNotificationToFirestore,
  saveEmergencyRequestToFirestore,
  deleteCommunityPostFromFirestore,
  updateAppointmentStatusInFirestore,
  updateSubmissionStatusInFirestore,
  saveUserProfile
} from "./lib/firebaseSync";

// Lucide icons
import { 
  Home, BookOpen, Users, HelpCircle, Heart, Bell, User as UserIcon, 
  Smile, Shield, AlertCircle, PhoneCall, Send, ArrowRight, Check,
  X, CheckCircle2, ChevronRight, MessageSquare, Plus, Lock, Calendar, ClipboardCheck, Sparkles, Cloud, CloudOff, CloudCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";


export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Elena Rostova
  const [activeTab, setActiveTab] = useState<string>("home"); // patient tabs: home, library, specialists, community, emergency, assessment, notifications

  // State arrays populated with seeded mock data
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [communityResponses, setCommunityResponses] = useState<CommunityResponse[]>(initialCommunityResponses);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(initialMoodLogs);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(initialEmergencyRequests);

  // Active Interactive Overlay Modals
  const [showChatbot, setShowChatbot] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<Specialist | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-07-15");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [showCheckout, setShowCheckout] = useState<{ specialist: Specialist; amount: number } | null>(null);
  const [activeCourseEnrollModal, setActiveCourseEnrollModal] = useState<Course | null>(null);

  // Patient Input states for inline features
  const [newMood, setNewMood] = useState<"serene" | "calm" | "neutral" | "anxious" | "exhausted" | "sad">("calm");
  const [newMoodNote, setNewMoodNote] = useState("");
  const [forumPostText, setForumPostText] = useState("");
  const [forumAnonymous, setForumAnonymous] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseFilter, setCourseCourseFilter] = useState<string>("All");

  // Homework submission local state
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [assignmentObservation, setAssignmentObservation] = useState("");

  // Specialist responses text state
  const [specialistReplyInputs, setSpecialistReplyInputs] = useState<Record<string, string>>({});

  // Recommendation tracking from assessment
  const [activeRemedies, setActiveRemedies] = useState<string[]>([]);

  // Firebase Authentication States & Form Control
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authRole, setAuthRole] = useState<"patient" | "specialist" | "admin">("patient");
  const [authError, setAuthError] = useState("");
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Count unread notifications
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // 1. Setup real-time Firebase syncing & seeding
  useEffect(() => {
    // Seed database if empty
    seedDatabaseIfEmpty();

    // Setup standard Firestore snap listeners to sync database in real-time
    const unsubMoods = onSnapshot(collection(db, "moodLogs"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as MoodLog);
        data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setMoodLogs(data);
      }
    });

    const unsubPosts = onSnapshot(collection(db, "communityPosts"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as CommunityPost);
        data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setCommunityPosts(data);
      }
    });

    const unsubResponses = onSnapshot(collection(db, "communityResponses"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as CommunityResponse);
        setCommunityResponses(data);
      }
    });

    const unsubAppts = onSnapshot(collection(db, "appointments"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as Appointment);
        setAppointments(data);
      }
    });

    const unsubEnrollments = onSnapshot(collection(db, "enrollments"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as Enrollment);
        setEnrollments(data);
      }
    });

    const unsubSubmissions = onSnapshot(collection(db, "submissions"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as Submission);
        setSubmissions(data);
      }
    });

    const unsubFeedbacks = onSnapshot(collection(db, "feedbacks"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as Feedback);
        setFeedbacks(data);
      }
    });

    const unsubNotifications = onSnapshot(collection(db, "notifications"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as Notification);
        data.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
        setNotifications(data);
      }
    });

    const unsubEmergency = onSnapshot(collection(db, "emergencyRequests"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(doc => doc.data() as EmergencyRequest);
        setEmergencyRequests(data);
      }
    });

    return () => {
      unsubMoods();
      unsubPosts();
      unsubResponses();
      unsubAppts();
      unsubEnrollments();
      unsubSubmissions();
      unsubFeedbacks();
      unsubNotifications();
      unsubEmergency();
    };
  }, []);

  // 2. Auth listener to sync logged in user state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setIsCloudSyncing(true);
        // Load profile
        try {
          const userDoc = await getDoc(doc(db, "users", fUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // Create default profile matching authenticated email
            const defaultProfile: User = {
              id: fUser.uid,
              fullName: fUser.displayName || fUser.email?.split("@")[0] || "Cloud Member",
              email: fUser.email || "",
              role: "patient",
              registrationDate: new Date().toISOString().substring(0, 10),
              languagePreference: "en",
              status: "active"
            };
            await saveUserProfile(defaultProfile);
            setCurrentUser(defaultProfile);
          }
        } catch (e) {
          console.error("Error fetching user doc:", e);
        }
      } else {
        setIsCloudSyncing(false);
      }
    });
    return unsubAuth;
  }, []);

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authEmail || !authPassword) {
      setAuthError("Please provide all required credentials.");
      return;
    }

    try {
      if (authIsSignUp) {
        // Register standard Email/Password
        const res = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const newUserProfile: User = {
          id: res.user.uid,
          fullName: authFullName || "New Cloud Member",
          email: authEmail,
          role: authRole,
          registrationDate: new Date().toISOString().substring(0, 10),
          languagePreference: "en",
          status: "active"
        };
        await saveUserProfile(newUserProfile);
        setCurrentUser(newUserProfile);
        alert(`Registered and connected successfully! Cloud sync active.`);
      } else {
        // Log in
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        alert(`Logged in successfully! Cloud database activated.`);
      }
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthFullName("");
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || "Authentication error encountered.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(mockUsers[0]);
      alert("Signed out of your Cloud profile. Switched back to guest mode.");
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = e.target.value;
    const found = mockUsers.find((u) => u.id === roleId);
    if (found) {
      setCurrentUser(found);
      if (found.role === "specialist") {
        setActiveTab("specialist-dashboard");
      } else if (found.role === "admin") {
        setActiveTab("admin-dashboard");
      } else {
        setActiveTab("home");
      }
    }
  };

  // Dynamic Mood Logging
  const handleLogMood = async (e: React.FormEvent) => {
    e.preventDefault();
    const moodScoreMap: Record<string, number> = {
      serene: 5, calm: 4, neutral: 3, anxious: 2, exhausted: 2, sad: 1
    };

    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      patientId: currentUser.id,
      mood: newMood,
      score: moodScoreMap[newMood],
      notes: newMoodNote.trim() || undefined,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setMoodLogs((prev) => [newLog, ...prev]);
    setNewMoodNote("");
    await saveMoodLogToFirestore(newLog);
    alert("Daily emotional wellness metric recorded successfully in cloud database.");
  };

  // Enroll Course (Free vs Premium check)
  const handleEnrollCourse = async (course: Course) => {
    if (course.isPremium) {
      // Direct checkout trigger
      setShowCheckout({
        specialist: {
          id: "course-checkout",
          fullName: `Premium Course: ${course.title}`,
          fees: course.price || 15,
          email: "", phone: "", specialization: "", experienceYears: 0, qualification: "", rating: 5, reviewsCount: 0, availabilityStatus: "available"
        },
        amount: course.price || 15
      });
      setActiveCourseEnrollModal(course);
      return;
    }

    const newEnroll: Enrollment = {
      id: `enroll-${Date.now()}`,
      patientId: currentUser.id,
      courseId: course.id,
      enrollmentDate: new Date().toISOString().substring(0, 10),
      status: "active",
      completionRate: 0
    };

    setEnrollments((prev) => [...prev, newEnroll]);
    await saveEnrollmentToFirestore(newEnroll);
    alert(`Successfully enrolled in ${course.title}. Launching your syllabus!`);
    setSelectedCourse(course);
  };

  // Complete Simulated Checkout
  const handleProcessCheckout = async () => {
    if (showCheckout) {
      if (activeCourseEnrollModal) {
        // Enrolling in course
        const newEnroll: Enrollment = {
          id: `enroll-${Date.now()}`,
          patientId: currentUser.id,
          courseId: activeCourseEnrollModal.id,
          enrollmentDate: new Date().toISOString().substring(0, 10),
          status: "active",
          completionRate: 0
        };
        setEnrollments((prev) => [...prev, newEnroll]);
        await saveEnrollmentToFirestore(newEnroll);
        setSelectedCourse(activeCourseEnrollModal);
        setActiveCourseEnrollModal(null);
        alert(`Checkout successful. You have gained full access to ${showCheckout.specialist.fullName}!`);
      } else {
        // Booking specialist appointment
        const newAppt: Appointment = {
          id: `appt-${Date.now()}`,
          patientId: currentUser.id,
          specialistId: showCheckout.specialist.id,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
          status: "approved", // Automatically approved for flow demonstration
          fees: showCheckout.amount,
          meetingLink: `https://zoom.us/j/ashwash-consultation-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: currentUser.fullName,
          specialistName: showCheckout.specialist.fullName
        };

        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          patientId: currentUser.id,
          title: "Appointment Booked Successfully",
          message: `Your session with ${showCheckout.specialist.fullName} on ${bookingDate} at ${bookingTime} is confirmed.`,
          notificationType: "appointment",
          isRead: false,
          sentAt: "Just now"
        };

        setAppointments((prev) => [newAppt, ...prev]);
        setNotifications((prev) => [newNotif, ...prev]);
        await saveAppointmentToFirestore(newAppt);
        await saveNotificationToFirestore(newNotif);
        alert(`Consultation booked successfully with ${showCheckout.specialist.fullName}! A Zoom link has been secured and synced to the cloud.`);
      }
      setShowCheckout(null);
    }
  };

  // Submit Homework Assignment
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId || !assignmentObservation.trim()) return;

    const targetAssign = mockAssignments.find((a) => a.id === submittingAssignmentId);

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: submittingAssignmentId,
      patientId: currentUser.id,
      uploadedFile: "somatic_practice_journal.pdf",
      observation: assignmentObservation.trim(),
      submissionTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "submitted",
      assignmentTitle: targetAssign?.title,
      patientName: currentUser.fullName
    };

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      patientId: currentUser.id,
      title: "Homework Log Transmitted",
      message: `Your journal submission for '${targetAssign?.title}' was uploaded to Dr. Sarah Jenkins.`,
      notificationType: "assignment",
      isRead: false,
      sentAt: "Just now"
    };

    setSubmissions((prev) => [newSub, ...prev]);
    setNotifications((prev) => [newNotif, ...prev]);
    await saveSubmissionToFirestore(newSub);
    await saveNotificationToFirestore(newNotif);
    setAssignmentObservation("");
    setSubmittingAssignmentId(null);
    alert("Homework log successfully synchronized and transmitted to specialist via Cloud.");
  };

  // Create Anonymous Forum Post
  const handleCreateForumPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      patientId: forumAnonymous ? "patient-anonymous" : currentUser.id,
      patientName: forumAnonymous ? "GentleStream" : currentUser.fullName,
      content: forumPostText.trim(),
      isAnonymous: forumAnonymous,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "active",
      reportsCount: 0
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
    setForumPostText("");
    await saveCommunityPostToFirestore(newPost);
    alert("Community post published and securely stored in Firestore.");
  };

  // Add Comment/Reply to Community Post
  const handleAddCommunityReply = async (postId: string) => {
    const text = specialistReplyInputs[postId];
    if (!text || !text.trim()) return;

    const newResp: CommunityResponse = {
      id: `resp-${Date.now()}`,
      postId: postId,
      responderId: currentUser.id,
      responderName: currentUser.fullName,
      responderRole: currentUser.role,
      replyText: text.trim(),
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setCommunityResponses((prev) => [...prev, newResp]);
    setSpecialistReplyInputs({ ...specialistReplyInputs, [postId]: "" });
    await saveCommunityResponseToFirestore(newResp);
  };

  // Report Post
  const handleReportPost = async (postId: string) => {
    const updatedPost = communityPosts.find((p) => p.id === postId);
    if (updatedPost) {
      const updated = { ...updatedPost, reportsCount: updatedPost.reportsCount + 1 };
      setCommunityPosts((prev) => 
        prev.map((p) => p.id === postId ? updated : p)
      );
      await saveCommunityPostToFirestore(updated);
    }
    alert("Post reported to platform moderators for immediate compliance review.");
  };

  // Specialist Actions
  const handleApproveAppointment = async (id: string) => {
    setAppointments((prev) => 
      prev.map((a) => a.id === id ? { ...a, status: "approved", meetingLink: "https://zoom.us/j/ashwash-consultation-9912" } : a)
    );
    await updateAppointmentStatusInFirestore(id, "approved");
  };

  const handleCancelAppointment = async (id: string) => {
    setAppointments((prev) => 
      prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a)
    );
    await updateAppointmentStatusInFirestore(id, "cancelled");
  };

  const handleSpecialistSubmitFeedback = async (subId: string, text: string, score: number) => {
    const targetSub = submissions.find((s) => s.id === subId);
    
    // Create new Feedback
    const newFb: Feedback = {
      id: `fb-${Date.now()}`,
      submissionId: subId,
      specialistId: currentUser.id,
      feedbackText: text,
      ratingScore: score,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      specialistName: currentUser.fullName
    };

    // Update Submission status
    setSubmissions((prev) => 
      prev.map((s) => s.id === subId ? { ...s, status: "reviewed" } : s)
    );
    setFeedbacks((prev) => [...prev, newFb]);

    await saveFeedbackToFirestore(newFb);
    await updateSubmissionStatusInFirestore(subId, "reviewed");

    // Send notification to patient
    if (targetSub) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        patientId: targetSub.patientId,
        title: "Homework Evaluated",
        message: `${currentUser.fullName} provided professional feedback on '${targetSub.assignmentTitle}'.`,
        notificationType: "feedback",
        isRead: false,
        sentAt: "Just now"
      };
      setNotifications((prev) => [newNotif, ...prev]);
      await saveNotificationToFirestore(newNotif);
    }

    alert("Feedback logged and shared with patient successfully.");
  };

  const handleForwardCase = (patientName: string, reason: string) => {
    alert(`Case file for ${patientName} referred and securely shared with Senior Specialist. Reason: ${reason}`);
  };

  // Admin Actions
  const handleToggleUserStatus = (id: string) => {
    setMoodLogs((prev) => prev); // dummy trigger
    alert(`Member status updated successfully.`);
  };

  const handleApproveCourse = (id: string) => {
    alert(`Course approved and published live.`);
  };

  const handleUpdateSubscriptionPrice = (id: string, price: number) => {
    alert(`Pricing tier ${id} updated to $${price} successfully.`);
  };

  const handleDeletePost = async (id: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== id));
    await deleteCommunityPostFromFirestore(id);
    alert("Post removed from community forum feed successfully.");
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Calculate mood scores for a decorative trend graph
  const recentMoods = [...moodLogs].reverse().slice(-5);

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md flex flex-col pb-[120px] md:pb-0 relative">
      
      {/* TOP HEADER / APP BAR */}
      <header className="bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 w-full sticky top-0 z-40 transition-all duration-300 border-b border-surface-container/50">
        <div className="flex items-center gap-3">
          <Logo layout="horizontal" size={38} />
          <span className="text-[10px] font-sans font-bold text-secondary bg-surface-container px-2 py-0.5 rounded hidden sm:inline-block">আশ্বাস</span>
        </div>

        {/* PROFILE ROLE-SWITCHER & CLOUD AUTHENTICATION */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          {firebaseUser ? (
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs transition-all text-xs font-semibold"
              title="Click to sign out of Cloud Profile"
            >
              <CloudCheck size={14} className="text-emerald-600" />
              <span className="hidden sm:inline">Sync Active</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                setAuthIsSignUp(false);
                setShowAuthModal(true);
              }}
              className="flex items-center gap-2 bg-amber-50 text-amber-800 hover:bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-xs transition-all text-xs font-semibold animate-pulse"
              title="Click to Connect Secure Cloud Account"
            >
              <Cloud size={14} className="text-amber-600" />
              <span>Connect Cloud</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full border border-surface-container-high shadow-xs">
            <UserIcon size={14} className="text-secondary" />
            <select 
              value={currentUser.id} 
              onChange={handleRoleSwitch}
              className="text-xs font-semibold text-deep-pine bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="user-patient-1">Patient: Elena Rostova</option>
              <option value="user-spec-1">Specialist: Dr. Jenkins</option>
              <option value="user-admin-1">Admin: Anwar Chowdhury</option>
              {firebaseUser && (
                <option value={firebaseUser.uid}>Cloud: {currentUser.fullName}</option>
              )}
            </select>
          </div>

          <button 
            onClick={() => {
              setActiveTab("notifications");
              markAllNotificationsAsRead();
            }}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center relative hover:bg-surface-container-high transition-all text-deep-pine"
          >
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-therapeutic-terracotta text-white font-mono text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CORE WEB CANVAS */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <nav className="hidden md:flex flex-col gap-3 w-64 bg-white border border-surface-container p-5 rounded-[2rem] shadow-soft-zen h-fit sticky top-24">
          <div className="text-center pb-4 border-b border-surface-container/60 mb-3">
            <p className="text-xs text-secondary font-mono uppercase tracking-widest">Active Workspace</p>
            <p className="text-sm font-bold text-deep-pine mt-0.5">{currentUser.fullName}</p>
          </div>

          {currentUser.role === "patient" && (
            <>
              <button 
                onClick={() => setActiveTab("home")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "home" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </button>

              <button 
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "library" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <BookOpen size={16} />
                <span>Course Library</span>
              </button>

              <button 
                onClick={() => setActiveTab("specialists")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "specialists" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <Users size={16} />
                <span>Specialist Directory</span>
              </button>

              <button 
                onClick={() => setActiveTab("community")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "community" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <MessageSquare size={16} />
                <span>Peer Community</span>
              </button>

              <button 
                onClick={() => setActiveTab("emergency")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "emergency" ? "bg-deep-pine text-white animate-pulse" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <PhoneCall size={16} />
                <span>Crisis & Grounding</span>
              </button>

              <button 
                onClick={() => setActiveTab("assessment")}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === "assessment" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
                }`}
              >
                <Smile size={16} />
                <span>Wellness Intake</span>
              </button>
            </>
          )}

          {currentUser.role === "specialist" && (
            <button 
              onClick={() => setActiveTab("specialist-dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "specialist-dashboard" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
              }`}
            >
              <ClipboardCheck size={16} />
              <span>Specialist Panel</span>
            </button>
          )}

          {currentUser.role === "admin" && (
            <button 
              onClick={() => setActiveTab("admin-dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "admin-dashboard" ? "bg-deep-pine text-white" : "text-secondary hover:bg-surface-container hover:text-deep-pine"
              }`}
            >
              <Shield size={16} />
              <span>Admin Control</span>
            </button>
          )}
        </nav>

        {/* PATIENT TABS AND OTHER DASHBOARD PORTALS */}
        <div className="flex-1 space-y-8">
          
          {/* PATIENT - HOME TABS */}
          {activeTab === "home" && currentUser.role === "patient" && (
            <div className="space-y-8">
              
              {/* Daily Mental Space greeting card */}
              <div className="relative rounded-[2.5rem] bg-alabaster-base shadow-ultra-soft p-8 md:p-12 overflow-hidden flex flex-col justify-between border border-white/50 group">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-sage-calm/30 rounded-full opacity-70 blur-2xl transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute -left-10 bottom-0 w-64 h-64 bg-secondary-fixed/40 rounded-full opacity-50 blur-2xl" />
                
                <div className="z-10 max-w-lg space-y-4">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest font-mono">Good Morning, {currentUser.fullName}</p>
                  <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine leading-tight">
                    How is your internal landscape today?
                  </h2>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed">
                    Take a quiet moment to anchor your nervous system before the day unfolds. Engage in our quick 6-question well-being intake.
                  </p>
                </div>

                <div className="z-10 flex flex-wrap gap-4 mt-8">
                  <button 
                    onClick={() => setActiveTab("assessment")}
                    className="bg-deep-pine text-alabaster-base font-semibold px-8 py-4 rounded-full hover:bg-primary transition-all duration-300 shadow-soft flex items-center gap-2"
                  >
                    <span>Start AI Intake</span>
                    <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTab("emergency")}
                    className="bg-sage-calm/50 text-deep-pine font-semibold px-8 py-4 rounded-full hover:bg-sage-calm transition-all duration-300"
                  >
                    Somatic Breathing
                  </button>
                </div>
              </div>

              {/* Grid with mood logs and list checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Mood Tracker */}
                <div className="bg-white border border-surface-container rounded-[2rem] p-6 shadow-soft-zen space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-deep-pine flex items-center gap-2">
                      <Smile size={20} className="text-therapeutic-terracotta" />
                      <span>Daily Emotional Check-in</span>
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">Visualize your psychological trends over time</p>
                  </div>

                  <form onSubmit={handleLogMood} className="space-y-4 bg-background p-4 rounded-2xl border border-surface-container">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">How do you feel right now?</label>
                      <select
                        value={newMood}
                        onChange={(e) => setNewMood(e.target.value as any)}
                        className="w-full text-body-md text-deep-pine bg-white border border-surface-container rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-therapeutic-terracotta cursor-pointer font-medium"
                      >
                        <option value="serene">Serene & Anchored</option>
                        <option value="calm">Calm & Centered</option>
                        <option value="neutral">Neutral / Peaceful</option>
                        <option value="anxious">Anxious / Overwhelmed</option>
                        <option value="sad">Heavy-Hearted / Sad</option>
                        <option value="exhausted">Exhausted / Burned Out</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Private Journal Note (Optional)</label>
                      <input
                        type="text"
                        value={newMoodNote}
                        onChange={(e) => setNewMoodNote(e.target.value)}
                        placeholder="Add some notes about your triggers..."
                        className="w-full text-body-md text-deep-pine bg-white border border-surface-container rounded-xl p-3 focus:outline-none placeholder-secondary/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-deep-pine hover:bg-primary text-white font-semibold py-3 rounded-full text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Record Wellness Log
                    </button>
                  </form>

                  {/* Micro Visual Trend Graph (simulated line plot) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-deep-pine uppercase tracking-wider">Mood Metric History</h4>
                    <div className="flex gap-2.5 items-end justify-between h-20 bg-background rounded-xl p-4 border border-surface-container">
                      {recentMoods.map((log) => (
                        <div key={log.id} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative">
                          <div 
                            className="w-full bg-deep-pine hover:bg-therapeutic-terracotta rounded-md transition-all relative"
                            style={{ height: `${log.score * 12}px` }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-deep-pine text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {log.mood}
                            </div>
                          </div>
                          <span className="text-[9px] text-secondary font-mono">{log.createdAt.substring(5, 10)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Courses Checklist */}
                <div className="bg-white border border-surface-container rounded-[2rem] p-6 shadow-soft-zen space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-deep-pine flex items-center gap-2">
                      <BookOpen size={20} className="text-mint-accent" />
                      <span>Recommended for You</span>
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">Somatic learning modules matching your state</p>
                  </div>

                  <div className="space-y-4">
                    {mockCourses.slice(0, 3).map((course) => {
                      const isEnrolled = enrollments.some((e) => e.courseId === course.id);
                      return (
                        <div key={course.id} className="flex gap-4 items-center bg-background p-3 rounded-xl border border-surface-container">
                          <img 
                            src={course.coverUrl} 
                            alt={course.title} 
                            className="w-14 h-14 rounded-lg object-cover bg-surface-container"
                          />
                          <div className="flex-1">
                            <span className="bg-sage-calm/50 text-deep-pine px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-mono">
                              {course.category}
                            </span>
                            <h4 className="text-body-md font-bold text-deep-pine mt-1 leading-tight">{course.title}</h4>
                            <p className="text-xs text-secondary leading-normal mt-0.5">{course.duration}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (isEnrolled) {
                                setSelectedCourse(course);
                                setActiveTab("library");
                              } else {
                                handleEnrollCourse(course);
                              }
                            }}
                            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                              isEnrolled 
                                ? "bg-surface-container text-deep-pine hover:bg-surface-container-high" 
                                : "bg-deep-pine text-white hover:bg-primary"
                            }`}
                          >
                            {isEnrolled ? "Resume" : "Enroll"}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => setActiveTab("library")}
                    className="w-full text-center text-xs font-bold text-secondary hover:text-deep-pine underline underline-offset-4 decoration-mint-accent decoration-2"
                  >
                    Browse Entire Syllabus Catalog
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PATIENT - LIBRARY TABS */}
          {activeTab === "library" && currentUser.role === "patient" && (
            <div className="space-y-8">
              
              {!selectedCourse ? (
                // Browse Catalog View
                <div className="space-y-8">
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-calm/40 text-deep-pine text-xs font-semibold rounded-full uppercase tracking-wider">
                      <BookOpen size={12} />
                      <span>Syllabus Directory</span>
                    </span>
                    <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">Structured Well-being Programs</h2>
                    <p className="text-body-md text-secondary">
                      Gentle, modular somatic lessons equipped with self-reflection homework tasks under authorized review.
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["All", "Anxiety Relief", "Breathwork", "Better Sleep", "Mindful Eating", "Parenting Support"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCourseCourseFilter(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                          courseFilter === cat ? "bg-deep-pine text-white" : "bg-white border border-surface-container text-secondary hover:text-deep-pine"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCourses
                      .filter((c) => courseFilter === "All" || c.category === courseFilter)
                      .map((course) => {
                        const isEnrolled = enrollments.some((e) => e.courseId === course.id);
                        return (
                          <div key={course.id} className="bg-white border border-surface-container rounded-[2rem] overflow-hidden shadow-soft-zen flex flex-col justify-between h-[390px] hover:-translate-y-1 transition-all duration-300">
                            <div className="h-40 relative">
                              <img src={course.coverUrl} alt={course.title} className="w-full h-full object-cover" />
                              {course.isPremium && (
                                <span className="absolute top-3 right-3 bg-therapeutic-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                                  Premium ${course.price}
                                </span>
                              )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="text-[10px] bg-surface-container text-secondary px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                                  {course.category}
                                </span>
                                <h3 className="font-headline-md text-lg text-deep-pine leading-tight font-bold">{course.title}</h3>
                                <p className="text-xs text-secondary leading-relaxed line-clamp-3">{course.description}</p>
                              </div>

                              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                                <span className="text-xs text-secondary font-medium">{course.duration}</span>
                                <button
                                  onClick={() => {
                                    if (isEnrolled) {
                                      setSelectedCourse(course);
                                    } else {
                                      handleEnrollCourse(course);
                                    }
                                  }}
                                  className="text-xs font-semibold px-5 py-2.5 rounded-full bg-deep-pine hover:bg-primary text-white transition-all shadow-sm"
                                >
                                  {isEnrolled ? "Resume Study" : "Enroll Program"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              ) : (
                // Active Syllabus Viewer
                <div className="space-y-8">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="text-xs font-semibold text-secondary hover:text-deep-pine flex items-center gap-1.5 hover:underline"
                  >
                    ← Back to Syllabus Directory
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Syllabus Checklist */}
                    <div className="lg:col-span-2 bg-white border border-surface-container p-6 md:p-8 rounded-[2rem] shadow-soft-zen space-y-6">
                      <div>
                        <span className="text-xs text-secondary uppercase font-bold font-mono tracking-widest">{selectedCourse.category}</span>
                        <h2 className="text-2xl font-bold text-deep-pine mt-1 leading-tight">{selectedCourse.title}</h2>
                        <p className="text-body-md text-secondary mt-2 leading-relaxed">{selectedCourse.description}</p>
                      </div>

                      <div className="space-y-4 border-t border-surface-container pt-6">
                        <h3 className="text-xs font-bold text-deep-pine uppercase tracking-widest mb-3">Syllabus Lessons & Audio</h3>
                        <div className="space-y-3">
                          {mockModules
                            .filter((m) => m.courseId === selectedCourse.id)
                            .map((module, index) => (
                              <div key={module.id} className="bg-background border border-surface-container p-4 rounded-xl flex justify-between items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-secondary font-mono w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <h4 className="text-body-md font-bold text-deep-pine">{module.title}</h4>
                                    <p className="text-xs text-secondary mt-0.5 uppercase tracking-wide font-mono font-medium">{module.contentType} • {module.duration}</p>
                                  </div>
                                </div>

                                {module.contentType === "audio" || module.contentType === "video" ? (
                                  <button
                                    onClick={() => alert(`Somatic audio playback initialized: ${module.contentUrl}`)}
                                    className="bg-deep-pine hover:bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
                                  >
                                    Listen / Play
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => alert(`Somatic lesson document display: "${module.contentUrl}"`)}
                                    className="bg-surface-container text-deep-pine hover:bg-surface-container-high text-xs font-semibold px-4 py-2 rounded-full"
                                  >
                                    Read Notes
                                  </button>
                                )}
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Assignments Box */}
                    <div className="bg-white border border-surface-container p-6 rounded-[2rem] shadow-soft-zen h-fit space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-deep-pine">Therapeutic Assignments</h3>
                        <p className="text-xs text-secondary mt-0.5">Submit to Dr. Sarah Jenkins for guidance</p>
                      </div>

                      <div className="space-y-4 border-t border-surface-container pt-6">
                        {mockAssignments
                          .filter((a) => a.courseId === selectedCourse.id)
                          .map((assign) => {
                            const isSubmitted = submissions.some((s) => s.assignmentId === assign.id);
                            const hasFeedback = feedbacks.find((f) => {
                              const matchingSub = submissions.find((s) => s.assignmentId === assign.id);
                              return matchingSub && f.submissionId === matchingSub.id;
                            });

                            return (
                              <div key={assign.id} className="bg-background p-4 rounded-xl border border-surface-container space-y-4">
                                <div>
                                  <h4 className="text-body-md font-bold text-deep-pine leading-tight">{assign.title}</h4>
                                  <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider mt-1">Deadline: {assign.deadline}</p>
                                  <p className="text-xs text-secondary leading-relaxed mt-2 italic">"{assign.instructions}"</p>
                                </div>

                                {isSubmitted ? (
                                  <div className="space-y-3 pt-3 border-t border-surface-container">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-mint-accent">
                                      <CheckCircle2 size={12} />
                                      <span>Transmitted to Dr. Jenkins</span>
                                    </span>

                                    {hasFeedback && (
                                      <div className="bg-white p-3 rounded-lg border border-surface-container text-xs text-on-surface-variant leading-relaxed">
                                        <p className="font-bold text-deep-pine text-[10px] uppercase tracking-wider mb-1">Feedback from Dr. Jenkins:</p>
                                        <p className="italic">"{hasFeedback.feedbackText}"</p>
                                        <p className="text-deep-pine font-semibold mt-2 font-mono">Score: {hasFeedback.ratingScore}/5</p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="pt-2">
                                    {submittingAssignmentId === assign.id ? (
                                      <form onSubmit={handleSubmitAssignment} className="space-y-3">
                                        <label className="block text-[10px] font-bold text-deep-pine uppercase tracking-wider">Describe your observations</label>
                                        <textarea
                                          value={assignmentObservation}
                                          onChange={(e) => setAssignmentObservation(e.target.value)}
                                          placeholder="Type your somatic log, anxiety triggers, or reflections..."
                                          className="w-full text-xs text-deep-pine bg-white border border-surface-container rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-therapeutic-terracotta"
                                          rows={3}
                                          required
                                        />
                                        <div className="flex gap-2 justify-end">
                                          <button
                                            type="button"
                                            onClick={() => setSubmittingAssignmentId(null)}
                                            className="px-3 py-1.5 bg-surface-container text-secondary rounded-full text-xs"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="submit"
                                            className="px-4 py-1.5 bg-deep-pine text-white hover:bg-primary font-bold rounded-full text-xs shadow-xs"
                                          >
                                            Transmit Homework
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <button
                                        onClick={() => setSubmittingAssignmentId(assign.id)}
                                        className="w-full bg-deep-pine hover:bg-primary text-white text-xs font-semibold py-2.5 rounded-full shadow-sm"
                                      >
                                        Complete Assignment Log
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATIENT - SPECIALIST DIRECTORY TABS */}
          {activeTab === "specialists" && currentUser.role === "patient" && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-calm/40 text-deep-pine text-xs font-semibold rounded-full uppercase tracking-wider">
                  <Users size={12} />
                  <span>Licensed Clinical Guides</span>
                </span>
                <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">Consultation Directory</h2>
                <p className="text-body-md text-secondary">
                  Connect with vetted, licensed psychologists and somatic guides. Book secure video consultations with auto-synced Zoom integration.
                </p>
              </div>

              {/* Specialists Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSpecialists.map((spec) => (
                  <div key={spec.id} className="bg-white border border-surface-container rounded-[2rem] p-6 shadow-soft-zen flex flex-col justify-between items-center text-center relative overflow-hidden h-[380px] hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-16 bg-sage-calm/15" />
                    
                    <div className="relative z-10 flex flex-col items-center mt-4">
                      <img 
                        src={spec.avatarUrl} 
                        alt={spec.fullName} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-surface-container"
                      />
                      <h3 className="text-lg font-bold text-deep-pine mt-3 leading-tight">{spec.fullName}</h3>
                      <p className="text-xs text-secondary font-medium">{spec.specialization}</p>
                      
                      <div className="flex items-center gap-1 text-xs text-secondary font-medium mt-2">
                        <span>⭐ <span className="text-deep-pine font-bold">{spec.rating}</span> ({spec.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed px-2">
                      {spec.qualification}. Over {spec.experienceYears} years helping individuals identify anxiety cues and somatic self-regulation strategies.
                    </p>

                    <div className="w-full pt-4 border-t border-surface-container flex items-center justify-between gap-4">
                      <span className="text-xs text-deep-pine font-semibold font-mono">${spec.fees}/session</span>
                      <button
                        onClick={() => setShowBookingModal(spec)}
                        className="bg-therapeutic-terracotta text-white hover:opacity-90 transition-all font-semibold text-xs px-5 py-2.5 rounded-full shadow-md shadow-therapeutic-terracotta/20"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATIENT - COMMUNITY FEED */}
          {activeTab === "community" && currentUser.role === "patient" && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-calm/40 text-deep-pine text-xs font-semibold rounded-full uppercase tracking-wider">
                  <MessageSquare size={12} />
                  <span>Peer-Support Portal</span>
                </span>
                <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">Anonymous Safe Haven</h2>
                <p className="text-body-md text-secondary">
                  Share experiences and ask questions with absolute, guaranteed anonymity, moderated under strict safety and compliance parameters.
                </p>
              </div>

              {/* Create Post Form */}
              <form onSubmit={handleCreateForumPost} className="bg-white border border-surface-container p-6 rounded-[2rem] shadow-soft-zen space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Write your heart out...</label>
                  <textarea
                    value={forumPostText}
                    onChange={(e) => setForumPostText(e.target.value)}
                    placeholder="Describe what's weighing heavy on your soul today. There is no judgment here..."
                    className="w-full text-body-md text-deep-pine bg-background border-none rounded-2xl p-4 focus:ring-1 focus:ring-therapeutic-terracotta focus:outline-none placeholder-secondary/50 leading-relaxed"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-xs font-semibold text-deep-pine cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forumAnonymous}
                      onChange={(e) => setForumAnonymous(e.target.checked)}
                      className="rounded border-surface-container text-deep-pine focus:ring-0"
                    />
                    <span>Hide my identity (Post anonymously)</span>
                  </label>

                  <button
                    type="submit"
                    className="bg-deep-pine hover:bg-primary text-white font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-sm"
                  >
                    Publish Post
                  </button>
                </div>
              </form>

              {/* Forum Feed */}
              <div className="space-y-6">
                {communityPosts.map((post) => {
                  const replies = communityResponses.filter((r) => r.postId === post.id);
                  return (
                    <div key={post.id} className="bg-white border border-surface-container rounded-[2rem] p-6 shadow-soft-zen space-y-4">
                      <div className="flex justify-between items-center border-b border-surface-container/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                            post.isAnonymous ? "bg-surface-container text-secondary" : "bg-sage-calm/40 text-deep-pine"
                          }`}>
                            {post.isAnonymous ? "🌱 GentleStream (Anonymous)" : post.patientName}
                          </span>
                          <span className="text-[10px] text-secondary font-mono">{post.createdAt}</span>
                        </div>

                        <button 
                          onClick={() => handleReportPost(post.id)}
                          className="text-xs text-secondary hover:text-red-500 font-semibold"
                        >
                          Report
                        </button>
                      </div>

                      <p className="text-body-lg text-deep-pine leading-relaxed font-medium italic">
                        "{post.content}"
                      </p>

                      {/* Comment Responses list */}
                      {replies.length > 0 && (
                        <div className="pl-6 border-l-2 border-surface-container space-y-3 pt-2">
                          {replies.map((rep) => (
                            <div key={rep.id} className="bg-background/80 border border-surface-container p-4 rounded-xl text-body-md leading-relaxed text-on-surface-variant">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className={`text-xs font-bold ${rep.responderRole === "specialist" ? "text-therapeutic-terracotta" : "text-deep-pine"}`}>
                                  {rep.responderName}
                                </span>
                                {rep.responderRole === "specialist" && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-therapeutic-terracotta px-1.5 py-0.5 rounded">
                                    Vetted Guide
                                  </span>
                                )}
                                <span className="text-[9px] text-secondary font-mono">{rep.createdAt}</span>
                              </div>
                              <p className="leading-relaxed">{rep.replyText}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Specialist/Vetted guide input to answer patient queries directly in the forum! */}
                      {currentUser.role === "specialist" && (
                        <div className="pt-2 pl-6 flex gap-3">
                          <input
                            type="text"
                            value={specialistReplyInputs[post.id] || ""}
                            onChange={(e) => setSpecialistReplyInputs({
                              ...specialistReplyInputs,
                              [post.id]: e.target.value
                            })}
                            placeholder="Provide professional, reassuring guidance to this patient query..."
                            className="flex-1 bg-background border border-surface-container px-4 py-2.5 rounded-full text-xs text-deep-pine focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddCommunityReply(post.id)}
                            className="bg-deep-pine text-white px-5 rounded-full text-xs font-bold hover:bg-primary shadow-xs"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PATIENT - CRISIS AND GROUNDING (EMERGENCY) */}
          {activeTab === "emergency" && currentUser.role === "patient" && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-3 animate-pulse">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  <AlertCircle size={12} />
                  <span>Immediate Crisis Care</span>
                </span>
                <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">You are not alone.</h2>
                <p className="text-body-md text-secondary">
                  If you are experiencing acute distress or thoughts of self-harm, please choose one of the secure support gateways below. They operate 24/7.
                </p>
              </div>

              {/* Bento Grid CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 988 call */}
                <button
                  onClick={() => alert("Simulating secure cellular connection to 988 Crisis Lifeline...")}
                  className="group relative bg-therapeutic-terracotta text-white rounded-[2rem] p-8 text-left shadow-soft flex flex-col justify-between min-h-[190px] border-none overflow-hidden hover:scale-[1.01] transition-all"
                >
                  <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                  <div className="space-y-2 z-10">
                    <span className="material-symbols-outlined text-4xl block">phone_in_talk</span>
                    <h3 className="text-xl font-bold leading-tight">Talk to Someone Now</h3>
                    <p className="text-xs opacity-90 leading-relaxed max-w-xs">Connect with a trained professional crisis counselor immediately via direct call.</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold z-10 flex items-center gap-1 mt-4">
                    <span>CALL 988</span>
                    <ArrowRight size={14} />
                  </span>
                </button>

                {/* 741741 text */}
                <button
                  onClick={() => alert("Simulating confidential SMS connection. Texting HOME to 741741...")}
                  className="group relative bg-deep-pine text-white rounded-[2rem] p-8 text-left shadow-soft flex flex-col justify-between min-h-[190px] border-none overflow-hidden hover:scale-[1.01] transition-all"
                >
                  <div className="space-y-2">
                    <span className="material-symbols-outlined text-4xl text-mint-accent block">sms</span>
                    <h3 className="text-xl font-bold leading-tight">Text Crisis Line</h3>
                    <p className="text-xs opacity-80 leading-relaxed max-w-xs">Prefer not to talk aloud? Start a text exchange with an anonymous counselor.</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-mint-accent flex items-center gap-1 mt-4">
                    <span>TEXT HOME TO 741741</span>
                    <ArrowRight size={14} />
                  </span>
                </button>
              </div>

              {/* Grounding and Somatic breathing exercise */}
              <div className="space-y-4">
                <div className="text-center max-w-xs mx-auto">
                  <h3 className="text-lg font-bold text-deep-pine">Grounding Somatic Practice</h3>
                  <p className="text-xs text-secondary mt-0.5">Use breathing pacing to immediately activate vagal soothing.</p>
                </div>
                <BreathingExercise />
              </div>
            </div>
          )}

          {/* PATIENT - WELLNESS INTAKE ASSESSMENT */}
          {activeTab === "assessment" && currentUser.role === "patient" && (
            <Assessment 
              onAddRecommendation={(rec) => setActiveRemedies((prev) => [rec, ...prev])}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* PATIENT - NOTIFICATIONS TABS */}
          {activeTab === "notifications" && currentUser.role === "patient" && (
            <div className="space-y-6">
              <div className="border-b border-surface-container pb-4">
                <h3 className="text-lg font-bold text-deep-pine">Notifications & System Alerts</h3>
                <p className="text-xs text-secondary mt-0.5">Track your appointment, assignment, and feedback logs</p>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-secondary">Your notifications mailbox is clear.</div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="bg-white border border-surface-container rounded-xl p-5 flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-deep-pine shrink-0">
                        {notif.notificationType === "appointment" ? <Calendar size={18} /> : <ClipboardCheck size={18} />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-body-md font-bold text-deep-pine leading-snug">{notif.title}</h4>
                        <p className="text-body-md text-on-surface-variant leading-relaxed">{notif.message}</p>
                        <span className="inline-block text-[9px] font-mono text-secondary font-semibold">{notif.sentAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SPECIALIST - WORKSPACE DASHBOARD */}
          {activeTab === "specialist-dashboard" && currentUser.role === "specialist" && (
            <SpecialistDashboard
              specialist={mockSpecialists[0]}
              appointments={appointments}
              submissions={submissions}
              onApproveAppointment={handleApproveAppointment}
              onCancelAppointment={handleCancelAppointment}
              onSubmitFeedback={handleSpecialistSubmitFeedback}
              onForwardCase={handleForwardCase}
            />
          )}

          {/* ADMIN - CONTROLS DASHBOARD */}
          {activeTab === "admin-dashboard" && currentUser.role === "admin" && (
            <AdminDashboard
              users={mockUsers}
              courses={mockCourses}
              posts={communityPosts}
              onToggleUserStatus={handleToggleUserStatus}
              onApproveCourse={handleApproveCourse}
              onUpdateSubscriptionPrice={handleUpdateSubscriptionPrice}
              onDeletePost={handleDeletePost}
            />
          )}
        </div>
      </main>

      {/* FLOATING COMPASSIONATE CHATBOT TOGGLE (PATIENT ONLY) */}
      {currentUser.role === "patient" && (
        <>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-deep-pine text-white flex items-center justify-center shadow-xl hover:bg-primary active:scale-95 transition-all"
            title="Chat with Ashwash Solace Bot"
          >
            <Sparkles size={24} className="text-mint-accent" />
          </button>

          <AnimatePresence>
            {showChatbot && (
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm"
              >
                <Chatbot onClose={() => setShowChatbot(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {currentUser.role === "patient" && (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-full bg-primary text-alabaster-base shadow-2xl z-50 flex justify-around items-center px-4 py-2 text-xs">
          <button 
            onClick={() => setActiveTab("home")}
            className={`p-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
              activeTab === "home" ? "bg-mint-accent text-primary scale-105" : "text-white/60 hover:text-white"
            }`}
          >
            <Home size={18} />
          </button>

          <button 
            onClick={() => {
              setActiveTab("library");
              setSelectedCourse(null);
            }}
            className={`p-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
              activeTab === "library" ? "bg-mint-accent text-primary scale-105" : "text-white/60 hover:text-white"
            }`}
          >
            <BookOpen size={18} />
          </button>

          <button 
            onClick={() => setActiveTab("specialists")}
            className={`p-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
              activeTab === "specialists" ? "bg-mint-accent text-primary scale-105" : "text-white/60 hover:text-white"
            }`}
          >
            <Users size={18} />
          </button>

          <button 
            onClick={() => setActiveTab("community")}
            className={`p-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
              activeTab === "community" ? "bg-mint-accent text-primary scale-105" : "text-white/60 hover:text-white"
            }`}
          >
            <MessageSquare size={18} />
          </button>

          <button 
            onClick={() => setActiveTab("emergency")}
            className={`p-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
              activeTab === "emergency" ? "bg-therapeutic-terracotta text-white scale-105 animate-pulse" : "text-white/60 hover:text-white"
            }`}
          >
            <PhoneCall size={18} />
          </button>
        </nav>
      )}

      {/* SPECIALIST DIRECTORY BOOKING MODAL */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 shadow-2xl relative border border-surface-container"
            >
              <button 
                onClick={() => setShowBookingModal(null)}
                className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-full text-secondary"
              >
                <X size={18} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-surface-container/60">
                  <img 
                    src={showBookingModal.avatarUrl} 
                    alt={showBookingModal.fullName} 
                    className="w-14 h-14 rounded-full object-cover bg-surface-container"
                  />
                  <div>
                    <span className="text-[10px] text-secondary font-semibold font-mono uppercase tracking-widest">Secure Reservation</span>
                    <h3 className="text-lg font-bold text-deep-pine leading-tight">{showBookingModal.fullName}</h3>
                    <p className="text-xs text-secondary mt-0.5">{showBookingModal.specialization}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Select Consultation Date</label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Select Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white cursor-pointer font-medium"
                    >
                      <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-container flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-secondary uppercase tracking-widest font-semibold block">Consultation Fee</span>
                    <span className="text-xl font-extrabold text-deep-pine font-mono">${showBookingModal.fees}</span>
                  </div>

                  <button
                    onClick={() => {
                      const spec = showBookingModal;
                      setShowBookingModal(null);
                      setShowCheckout({ specialist: spec, amount: spec.fees });
                    }}
                    className="bg-deep-pine hover:bg-primary text-white font-semibold text-xs px-6 py-3 rounded-full shadow-md uppercase tracking-wider"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT GATEWAY SIMULATOR MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 shadow-2xl relative border border-surface-container overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage-calm via-mint-accent to-therapeutic-terracotta" />
              
              <button 
                onClick={() => {
                  setShowCheckout(null);
                  setActiveCourseEnrollModal(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-full text-secondary"
              >
                <X size={18} />
              </button>

              <div className="space-y-6">
                <div className="text-center space-y-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container text-deep-pine text-[10px] font-bold uppercase tracking-wider rounded-full">
                    <Lock size={10} className="text-mint-accent" />
                    <span>SSL Encrypted Checkout</span>
                  </span>
                  <h3 className="text-lg font-bold text-deep-pine">Secure Invoice Payment</h3>
                </div>

                <div className="bg-background border border-surface-container p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-secondary font-medium">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between text-sm text-deep-pine font-bold leading-tight">
                    <span className="max-w-[80%]">{showCheckout.specialist.fullName}</span>
                    <span className="font-mono">${showCheckout.amount}.00</span>
                  </div>
                </div>

                {/* Simulated credit card entry */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Credit Card Number</label>
                    <input 
                      type="text" 
                      placeholder="••••  ••••  ••••  9912" 
                      defaultValue="4111 2222 3333 9912"
                      disabled
                      className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-surface-container-lowest font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        defaultValue="12/29"
                        disabled
                        className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-surface-container-lowest font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">CVC</label>
                      <input 
                        type="text" 
                        placeholder="•••" 
                        defaultValue="385"
                        disabled
                        className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-surface-container-lowest font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProcessCheckout}
                  className="w-full bg-deep-pine hover:bg-primary text-white font-semibold py-4 rounded-full text-xs uppercase tracking-wider shadow-md shadow-deep-pine/20"
                >
                  Pay & Authorize ${showCheckout.amount}.00
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIREBASE AUTHENTICATION & CLOUD SYNC MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-7 shadow-2xl relative border border-surface-container overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-deep-pine animate-pulse" />
              
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError("");
                }}
                className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-full text-secondary"
              >
                <X size={18} />
              </button>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="flex justify-center">
                  <Logo layout="icon-only" size={70} />
                </div>
                <div className="text-center space-y-1 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-full mx-auto">
                    <CloudCheck size={11} className="text-emerald-600 animate-bounce" />
                    <span>Secure Cloud Sync Engaged</span>
                  </span>
                  <h3 className="text-xl font-bold text-deep-pine">
                    {authIsSignUp ? "Create Cloud Account" : "Access Cloud Profile"}
                  </h3>
                  <p className="text-xs text-secondary max-w-xs mx-auto leading-normal">
                    Secure your personal emotional metrics, comments, and consultation bookings in real-time.
                  </p>
                </div>

                {authError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  {authIsSignUp && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-deep-pine uppercase tracking-wider">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Elena Rostova" 
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        className="w-full text-xs font-medium text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none focus:ring-1 focus:ring-deep-pine"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-deep-pine uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="member@ashwash.org" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full text-xs font-medium text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none focus:ring-1 focus:ring-deep-pine"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-deep-pine uppercase tracking-wider">Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full text-xs font-medium text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none focus:ring-1 focus:ring-deep-pine"
                    />
                  </div>

                  {authIsSignUp && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-deep-pine uppercase tracking-wider">Account Workspace Role</label>
                      <select
                        value={authRole}
                        onChange={(e) => setAuthRole(e.target.value as any)}
                        className="w-full text-xs font-semibold text-deep-pine border border-surface-container rounded-xl p-3 bg-white cursor-pointer"
                      >
                        <option value="patient">Patient (Mental Health Seeker)</option>
                        <option value="specialist">Specialist (Mental Health Clinician)</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-deep-pine hover:bg-primary text-white font-semibold py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    {authIsSignUp ? "Register Cloud Account" : "Secure Sign In"}
                  </button>
                </div>

                <div className="text-center pt-2 border-t border-surface-container/60">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthIsSignUp(!authIsSignUp);
                      setAuthError("");
                    }}
                    className="text-xs text-secondary hover:text-deep-pine font-semibold transition-all underline decoration-dotted"
                  >
                    {authIsSignUp ? "Already have a cloud profile? Sign In" : "New to Ashwash? Establish a secure cloud profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
