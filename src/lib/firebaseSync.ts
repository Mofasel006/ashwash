import { 
  db, auth, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, onSnapshot 
} from "../firebase";
import { 
  mockUsers, mockSpecialists, mockCourses, mockModules, 
  mockAssignments, initialEnrollments, initialSubmissions, 
  initialFeedbacks, initialAppointments, initialCommunityPosts, 
  initialCommunityResponses, initialNotifications, initialMoodLogs, 
  initialEmergencyRequests 
} from "../mockData";
import { 
  User, Specialist, Course, Enrollment, Submission, 
  Feedback, Appointment, CommunityPost, CommunityResponse, 
  Notification, MoodLog, EmergencyRequest 
} from "../types";

// Seed Database helper to populate Firestore if empty
export async function seedDatabaseIfEmpty() {
  try {
    const postsSnap = await getDocs(collection(db, "communityPosts"));
    if (postsSnap.empty) {
      console.log("Firestore collections are empty. Seeding database with beautiful pre-configured records...");
      
      // Seed Users
      for (const user of mockUsers) {
        await setDoc(doc(db, "users", user.id), user);
      }
      
      // Seed Specialists
      for (const spec of mockSpecialists) {
        await setDoc(doc(db, "specialists", spec.id), spec);
      }
      
      // Seed Enrollments
      for (const enroll of initialEnrollments) {
        await setDoc(doc(db, "enrollments", enroll.id), enroll);
      }
      
      // Seed Submissions
      for (const sub of initialSubmissions) {
        await setDoc(doc(db, "submissions", sub.id), sub);
      }
      
      // Seed Feedbacks
      for (const fb of initialFeedbacks) {
        await setDoc(doc(db, "feedbacks", fb.id), fb);
      }
      
      // Seed Appointments
      for (const appt of initialAppointments) {
        await setDoc(doc(db, "appointments", appt.id), appt);
      }
      
      // Seed Community Posts
      for (const post of initialCommunityPosts) {
        await setDoc(doc(db, "communityPosts", post.id), post);
      }
      
      // Seed Community Responses
      for (const resp of initialCommunityResponses) {
        await setDoc(doc(db, "communityResponses", resp.id), resp);
      }
      
      // Seed Notifications
      for (const notif of initialNotifications) {
        await setDoc(doc(db, "notifications", notif.id), notif);
      }
      
      // Seed Mood Logs
      for (const mood of initialMoodLogs) {
        await setDoc(doc(db, "moodLogs", mood.id), mood);
      }
      
      // Seed Emergency Requests
      for (const emg of initialEmergencyRequests) {
        await setDoc(doc(db, "emergencyRequests", emg.id), emg);
      }
      
      console.log("Seeding complete!");
    } else {
      console.log("Firestore database already contains live records.");
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

// Save dynamic documents helpers
export async function saveMoodLogToFirestore(log: MoodLog) {
  try {
    await setDoc(doc(db, "moodLogs", log.id), log);
  } catch (e) {
    console.error("Error saving mood log:", e);
  }
}

export async function saveCommunityPostToFirestore(post: CommunityPost) {
  try {
    await setDoc(doc(db, "communityPosts", post.id), post);
  } catch (e) {
    console.error("Error saving community post:", e);
  }
}

export async function saveCommunityResponseToFirestore(resp: CommunityResponse) {
  try {
    await setDoc(doc(db, "communityResponses", resp.id), resp);
  } catch (e) {
    console.error("Error saving community response:", e);
  }
}

export async function saveAppointmentToFirestore(appt: Appointment) {
  try {
    await setDoc(doc(db, "appointments", appt.id), appt);
  } catch (e) {
    console.error("Error saving appointment:", e);
  }
}

export async function saveEnrollmentToFirestore(enroll: Enrollment) {
  try {
    await setDoc(doc(db, "enrollments", enroll.id), enroll);
  } catch (e) {
    console.error("Error saving enrollment:", e);
  }
}

export async function saveSubmissionToFirestore(sub: Submission) {
  try {
    await setDoc(doc(db, "submissions", sub.id), sub);
  } catch (e) {
    console.error("Error saving submission:", e);
  }
}

export async function saveFeedbackToFirestore(fb: Feedback) {
  try {
    await setDoc(doc(db, "feedbacks", fb.id), fb);
  } catch (e) {
    console.error("Error saving feedback:", e);
  }
}

export async function saveNotificationToFirestore(notif: Notification) {
  try {
    await setDoc(doc(db, "notifications", notif.id), notif);
  } catch (e) {
    console.error("Error saving notification:", e);
  }
}

export async function saveEmergencyRequestToFirestore(emg: EmergencyRequest) {
  try {
    await setDoc(doc(db, "emergencyRequests", emg.id), emg);
  } catch (e) {
    console.error("Error saving emergency request:", e);
  }
}

export async function deleteCommunityPostFromFirestore(postId: string) {
  try {
    await deleteDoc(doc(db, "communityPosts", postId));
  } catch (e) {
    console.error("Error deleting post:", e);
  }
}

export async function updateAppointmentStatusInFirestore(apptId: string, status: "pending" | "approved" | "cancelled" | "completed") {
  try {
    await updateDoc(doc(db, "appointments", apptId), { status });
  } catch (e) {
    console.error("Error updating appointment status:", e);
  }
}

export async function updateSubmissionStatusInFirestore(subId: string, status: "submitted" | "reviewed") {
  try {
    await updateDoc(doc(db, "submissions", subId), { status });
  } catch (e) {
    console.error("Error updating submission status:", e);
  }
}

export async function saveUserProfile(user: User) {
  try {
    await setDoc(doc(db, "users", user.id), user);
  } catch (e) {
    console.error("Error saving user profile:", e);
  }
}
