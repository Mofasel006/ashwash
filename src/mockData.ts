import { 
  User, Specialist, Course, CourseModule, Assignment, 
  Submission, Feedback, Appointment, CommunityPost, 
  CommunityResponse, EmergencyRequest, Payment, Notification, 
  MoodLog, AssessmentRecord, Enrollment 
} from "./types";

// Static default user accounts for role switching
export const mockUsers: User[] = [
  {
    id: "user-patient-1",
    fullName: "Elena Rostova",
    email: "mdmofasel512@gmail.com", // Matches the email of user for personalization
    phone: "+8801712345678",
    age: 28,
    gender: "Female",
    lifeCategory: "First-Time Mother",
    languagePreference: "en",
    role: "patient",
    registrationDate: "2026-05-10",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtpDNVIVSlvmcSGA03WNg-xkUt-SQHzdqjCDoNzFCfRARkV7l4y_Qhjueb99YUbACw8_BTEKTYHTIKxNRZXFpVcb7vygTxiHHZfYBzxlBwfOdsRbw5_hubgATZ4n_7eGRzMXWGcmd4VYd0-u-_FjBy3fqLKtHs_cplUoCFrsIpPlf4XasBlt5tdGuFblOAyT8JMkfLA4L3Qu9JLphS55Gb8gNzzWb2AQhRsRanIVOTkCwbl5jG6RmDjBJFkx5dqkvpQ8CYnKRpx0Q",
    status: "active"
  },
  {
    id: "user-spec-1",
    fullName: "Dr. Sarah Jenkins, Ph.D.",
    email: "sarah.jenkins@ashwash.org",
    phone: "+1-555-019-9231",
    age: 42,
    gender: "Female",
    lifeCategory: "Clinical Psychologist",
    languagePreference: "en",
    role: "specialist",
    registrationDate: "2025-01-15",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxhQzwF4HptSVLzPhOMctM4xH55bV1JfnZzXUn2r5B1bBvs_J81BqYuX2m_qtUkvodYlyk44rziS1cWid8QYKCE5JyiPK1mP_Ju7IX5VT9MJDaqGiNfiMAW8o0JzSRgfiRuSJ3efNy0yNGkgpAmNpMnSO450QLIm7pAnMp0cpZYvif9ZS81F-drCIhF0Qfs-2y0EYneE_Ez38guP32Da0s4efK8Wyutq3q7CuGkArV1k1vziqWwhdWuKQvp3UoWcqvMEskJEZ-uHA",
    status: "active"
  },
  {
    id: "user-admin-1",
    fullName: "Anwar Chowdhury",
    email: "admin@ashwash.org",
    phone: "+8801812345678",
    age: 35,
    gender: "Male",
    lifeCategory: "Platform Director",
    languagePreference: "en",
    role: "admin",
    registrationDate: "2024-12-01",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    status: "active"
  }
];

export const mockSpecialists: Specialist[] = [
  {
    id: "user-spec-1",
    fullName: "Dr. Sarah Jenkins, Ph.D.",
    email: "sarah.jenkins@ashwash.org",
    phone: "+1-555-019-9231",
    specialization: "Clinical Psychologist",
    experienceYears: 14,
    qualification: "Ph.D. in Clinical Psychology, Yale University",
    rating: 4.9,
    reviewsCount: 120,
    availabilityStatus: "available",
    fees: 50,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxhQzwF4HptSVLzPhOMctM4xH55bV1JfnZzXUn2r5B1bBvs_J81BqYuX2m_qtUkvodYlyk44rziS1cWid8QYKCE5JyiPK1mP_Ju7IX5VT9MJDaqGiNfiMAW8o0JzSRgfiRuSJ3efNy0yNGkgpAmNpMnSO450QLIm7pAnMp0cpZYvif9ZS81F-drCIhF0Qfs-2y0EYneE_Ez38guP32Da0s4efK8Wyutq3q7CuGkArV1k1vziqWwhdWuKQvp3UoWcqvMEskJEZ-uHA"
  },
  {
    id: "spec-2",
    fullName: "Michael Chang, LPC",
    email: "michael.chang@ashwash.org",
    phone: "+1-555-012-4411",
    specialization: "Licensed Professional Counselor",
    experienceYears: 9,
    qualification: "M.S. in Counseling, Stanford University",
    rating: 4.8,
    reviewsCount: 85,
    availabilityStatus: "available",
    fees: 40,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAERWf8UycLvq-uL64PKbsFTEwa1p89jpKZSWUsHhdRbS0MNK7WI8rUGVTBHZrDoprG4FqoDQvwQ8YM4xsJ5o96F7Ux2IUjPRZGb2GCpyBfIz5qo0gdfsNoUxXURAe820pYFqh1bVPJl3Z4ASw5N-b6StmaE9hD4sXI8yYPD90EHHEcY9XFCQLwDOryUucpfzXTlM8ClZiskpelXbmggLREJBMSmaGs2qFvOBPvHimenGzLHLCijABTzt9LTzjBFZxFwSybC7DoSvs"
  },
  {
    id: "spec-3",
    fullName: "Elena Rodriguez, LCSW",
    email: "elena.rodriguez@ashwash.org",
    phone: "+1-555-016-1188",
    specialization: "Licensed Clinical Social Worker",
    experienceYears: 11,
    qualification: "Master of Social Work, Columbia University",
    rating: 5.0,
    reviewsCount: 42,
    availabilityStatus: "available",
    fees: 45,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXkO3tIdxCP1by_YNeSdGWLbx9OKU-wWVmu_0rYKODzHu2eyy-zkX_LVvdk2QMeXm4bVYNCd_eDMEDkCYxCnGA6zFcvfMc5ivydCfA9jXKdtgGYkjyCwc8L9hhJgqkv1BfYq-s_lHkxXSjGkyfeG_UMoazzaUqOdE0SZswH4RYhqvEHqT8jKgqXA8tHmdQ6ihImX8MyBOFYOcezCymlSJxVb7mbnmd5esoe-4Hpccf_2SwEKvCJhYUMVuMtMPOUU6PrM519_jdP78"
  }
];

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "The Quiet Mind",
    description: "Learn essential cognitive and grounding techniques to gently disengage from racing thoughts and establish mental clarity in the present moment.",
    category: "Anxiety Relief",
    duration: "10 Sessions",
    rating: 4.9,
    modulesCount: 10,
    enrolledCount: 1450,
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKcSP0Vs2rdUe-w3GC1DdDQkJRVjQA-pDkHKnBUz7yUL0jyjV1vJHB_IYcCh8BUqnoSubnhO4CmLDIJzfVK6sHWvBUPrGadGbgxT-dsnSI1Ps_KQeBbiZOVsMwho_YHRWmn4Daws1kvVFfZeECL2io6RCM8y3ppbFIBgmsnMHAL-XkQFBUxItiHN3cqDAuIrNE13TGwwApWYY7AWXhN45dWyVScHqr1dFptx8GOulSgdICICY48m-QlwLsrHsQgEJaMLiQEISWB2k",
    isPremium: false
  },
  {
    id: "course-2",
    title: "Oceanic Breathing",
    description: "Align your physiological rhythm with the slow, persistent cadence of deep ocean tides using structured breathwork and diaphragmatic pacing.",
    category: "Breathwork",
    duration: "6 Sessions",
    rating: 4.8,
    modulesCount: 6,
    enrolledCount: 980,
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5tvO_RkmUPoszEBHJQ3YEM9pCc1_yBoJzbXWVM4eMtoe5WdZHdsJTbAzJwoJf-i5YRK8SFb4rwBh3lQZUxJdDFpYsY9_lxoYbKLrQeLBROtRmEe-CkNYltOwymT8jTI7V-oV7m7Jq9blszAV5iADAwfNSXWnI9YbuiqYpVJ_dh7e66TW5_Xwo6O-Q5wsRxPTGh-KVPX8GW7ml_Gbf3zTpecNMzvt6Z5JMHDS4EDDRLBw4TO5EQSaJ3DPkM8keMOVeKPSQ_c19W4c",
    isPremium: false
  },
  {
    id: "course-3",
    title: "Drifting Off",
    description: "A guided auditory and sleep-induction journey designed to assist your mind in smoothly transitioning from daily analytical focus to deep, restorative rest.",
    category: "Better Sleep",
    duration: "8 Sessions",
    rating: 4.7,
    modulesCount: 8,
    enrolledCount: 2200,
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHg_oHEUHcidpKILxoQ0GVdB9-GXS--CAl847CnPbkUEJXXQ39ifTNuHyKRppmipVa1UjABLgOs8AcEJcBkHtkynkoIcHZzHS2LJBstJzJA_GisbAuD_tUH4pHIKzn6bMZKDOMLvmyYa9dpNEjr10RL4JPf1XAZvkf8W6OEIMtFm5-IaoVNNgZW3Bczm0Rb-wB4LtBeWImbr9n8UwtLpFzWJCdSELUww9qecj3uDzEx5T-n73tR19t3QtchMV96MqAST-lxZ-9hWI",
    isPremium: true,
    price: 15
  },
  {
    id: "course-4",
    title: "Mindful Feeding",
    description: "Re-establish a loving, healthy relationship with food. Learn to identify physical vs emotional hunger using mindful chewing and sensory grounding.",
    category: "Mindful Eating",
    duration: "5 Sessions",
    rating: 4.6,
    modulesCount: 5,
    enrolledCount: 450,
    coverUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    isPremium: true,
    price: 12
  },
  {
    id: "course-5",
    title: "Calm Parenting",
    description: "Gentle techniques to regulate your own nervous system, respond rather than react to children's emotional outbursts, and co-regulate with your child.",
    category: "Parenting Support",
    duration: "12 Sessions",
    rating: 4.9,
    modulesCount: 12,
    enrolledCount: 740,
    coverUrl: "https://images.unsplash.com/photo-1536640717400-7c5b1690562d?auto=format&fit=crop&q=80&w=400",
    isPremium: false
  }
];

export const mockModules: CourseModule[] = [
  {
    id: "mod-1-1",
    courseId: "course-1",
    title: "Session 1: Understanding Racing Thoughts",
    duration: "12 Min",
    contentType: "audio",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "mod-1-2",
    courseId: "course-1",
    title: "Session 2: The 5-4-3-2-1 Sensory Grounding Technique",
    duration: "15 Min",
    contentType: "audio",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "mod-1-3",
    courseId: "course-1",
    title: "Session 3: Rewriting Negative Thought Loops",
    duration: "18 Min",
    contentType: "text",
    contentUrl: "The 3-step reframing exercise: Notice, Pause, Reframe."
  },
  {
    id: "mod-2-1",
    courseId: "course-2",
    title: "Session 1: Intro to Diaphragmatic Breathing",
    duration: "10 Min",
    contentType: "video",
    contentUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "mod-2-2",
    courseId: "course-2",
    title: "Session 2: The 4-7-8 Breathing Cadence",
    duration: "15 Min",
    contentType: "audio",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: "assign-1",
    courseId: "course-1",
    title: "Daily Journal: Identify 3 Anxiety Triggers",
    deadline: "2026-07-20",
    instructions: "Over the next 3 days, write down instances when you felt sudden anxiety. Identify: (1) what you were doing, (2) the physical sensations, (3) the subsequent automatic thought. Submit as a text or file write-up."
  },
  {
    id: "assign-2",
    courseId: "course-2",
    title: "4-7-8 Pacing Practice Log",
    deadline: "2026-07-22",
    instructions: "Perform the 4-7-8 breathing exercise twice daily (morning & night) for 5 cycles. Describe how your heart rate and muscle tension changed afterward."
  }
];

// Initial states for patient
export const initialEnrollments: Enrollment[] = [
  {
    id: "enroll-1",
    patientId: "user-patient-1",
    courseId: "course-1",
    enrollmentDate: "2026-07-01",
    status: "active",
    completionRate: 40 // 4 out of 10 sessions completed
  },
  {
    id: "enroll-2",
    patientId: "user-patient-1",
    courseId: "course-2",
    enrollmentDate: "2026-07-10",
    status: "active",
    completionRate: 0
  }
];

export const initialSubmissions: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    patientId: "user-patient-1",
    uploadedFile: "anxiety_triggers_log.pdf",
    observation: "I noticed that my primary triggers are late-afternoon work slumps and drinking excess caffeine before meetings. When I paused and focused on my breath, the muscle tightness in my shoulders reduced significantly.",
    submissionTime: "2026-07-12 18:45",
    status: "submitted",
    assignmentTitle: "Daily Journal: Identify 3 Anxiety Triggers",
    patientName: "Elena Rostova"
  }
];

export const initialFeedbacks: Feedback[] = [
  {
    id: "fb-1",
    submissionId: "sub-1",
    specialistId: "user-spec-1",
    feedbackText: "Superb self-reflection, Elena. Recognizing the physical sensations is the key first step. Next time, try implementing the 5-4-3-2-1 technique right at the moment you notice shoulder tightness before the meeting starts. Keep up the consistent effort!",
    ratingScore: 5,
    createdAt: "2026-07-13 09:30",
    specialistName: "Dr. Sarah Jenkins, Ph.D."
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: "appt-1",
    patientId: "user-patient-1",
    specialistId: "user-spec-1",
    appointmentDate: "2026-07-15",
    appointmentTime: "10:00 AM",
    status: "approved",
    fees: 50,
    meetingLink: "https://zoom.us/j/ashwash-consultation-9912",
    patientName: "Elena Rostova",
    specialistName: "Dr. Sarah Jenkins, Ph.D."
  },
  {
    id: "appt-2",
    patientId: "user-patient-1",
    specialistId: "spec-2",
    appointmentDate: "2026-07-22",
    appointmentTime: "02:30 PM",
    status: "pending",
    fees: 40,
    patientName: "Elena Rostova",
    specialistName: "Michael Chang, LPC"
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    patientId: "patient-anonymous-1",
    patientName: "GentleStream",
    content: "Has any other first-time mother experienced intense guilt over wanting just 1 hour of quiet alone time? I love my baby so much, but some days I feel like I'm completely suffocating...",
    isAnonymous: true,
    createdAt: "2026-07-13 14:20",
    status: "active",
    reportsCount: 0
  },
  {
    id: "post-2",
    patientId: "user-patient-1",
    patientName: "Elena Rostova",
    content: "Taking a deep breath and doing 'Oceanic Breathing' really saved me today. Highly recommend it to anyone dealing with high workload stress.",
    isAnonymous: false,
    createdAt: "2026-07-12 11:15",
    status: "active",
    reportsCount: 0
  },
  {
    id: "post-3",
    patientId: "patient-anonymous-2",
    patientName: "QuietForest",
    content: "Is it normal to feel a sudden wave of panic out of nowhere when everything is quiet? Like my brain is actively searching for things to worry about.",
    isAnonymous: true,
    createdAt: "2026-07-13 16:45",
    status: "active",
    reportsCount: 0
  }
];

export const initialCommunityResponses: CommunityResponse[] = [
  {
    id: "resp-1",
    postId: "post-1",
    responderId: "user-spec-1",
    responderName: "Dr. Sarah Jenkins, Ph.D.",
    responderRole: "specialist",
    replyText: "Please know that this is incredibly normal, GentleStream. Caring for a newborn is a monumental physical and psychological task. Your desire for quiet alone time is not a sign of lacking love; it is your nervous system signaling a need for self-regulation. Allowing yourself that time makes you a more regulated, present mother.",
    createdAt: "2026-07-13 15:10"
  },
  {
    id: "resp-2",
    postId: "post-1",
    responderId: "patient-anonymous-3",
    responderName: "SensingPeace",
    responderRole: "patient",
    replyText: "Yes, completely normal! I felt that way for months. You are definitely not alone. Hugs!",
    createdAt: "2026-07-13 15:40"
  }
];

export const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    patientId: "user-patient-1",
    title: "Appointment Confirmed",
    message: "Your session with Dr. Sarah Jenkins is scheduled and approved for July 15th at 10:00 AM.",
    notificationType: "appointment",
    isRead: false,
    sentAt: "2026-07-13 10:00"
  },
  {
    id: "notif-2",
    patientId: "user-patient-1",
    title: "Homework Reviewed",
    message: "Dr. Sarah Jenkins has reviewed your 'Anxiety Triggers Log' and provided detailed feedback.",
    notificationType: "feedback",
    isRead: true,
    sentAt: "2026-07-13 09:31"
  }
];

export const initialMoodLogs: MoodLog[] = [
  {
    id: "mood-1",
    patientId: "user-patient-1",
    mood: "calm",
    score: 4,
    notes: "Felt peaceful after completing morning meditation",
    createdAt: "2026-07-09 08:30"
  },
  {
    id: "mood-2",
    patientId: "user-patient-1",
    mood: "anxious",
    score: 2,
    notes: "Work stress piling up due to upcoming deadline",
    createdAt: "2026-07-10 17:15"
  },
  {
    id: "mood-3",
    patientId: "user-patient-1",
    mood: "neutral",
    score: 3,
    notes: "Tired but relatively grounded after breathwork",
    createdAt: "2026-07-11 12:00"
  },
  {
    id: "mood-4",
    patientId: "user-patient-1",
    mood: "serene",
    score: 5,
    notes: "Wonderful day spending time in nature",
    createdAt: "2026-07-12 15:30"
  },
  {
    id: "mood-5",
    patientId: "user-patient-1",
    mood: "neutral",
    score: 3,
    notes: "Log for today",
    createdAt: "2026-07-13 19:40"
  }
];

export const initialEmergencyRequests: EmergencyRequest[] = [
  {
    id: "emg-1",
    patientId: "user-patient-1",
    patientName: "Elena Rostova",
    urgencyLevel: "high",
    status: "resolved",
    createdAt: "2026-06-25 22:30",
    notes: "Experienced panic attack during flight. Guided to breathing tools by staff."
  }
];

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    patientId: "user-patient-1",
    amount: 50,
    paymentMethod: "Visa Card",
    transactionId: "TXN-ASHWASH-99120",
    status: "successful",
    date: "2026-07-13 10:15",
    description: "Consultation Session booking - Dr. Sarah Jenkins"
  }
];
