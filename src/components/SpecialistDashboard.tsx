import React, { useState } from "react";
import { 
  Appointment, Submission, Specialist, Feedback, 
  Course, Assignment, User 
} from "../types";
import { 
  Users, Calendar, FileText, CheckCircle2, XCircle, 
  Video, Save, Plus, ArrowUpRight, Check, AlertTriangle, ShieldCheck 
} from "lucide-react";

interface SpecialistDashboardProps {
  specialist: Specialist;
  appointments: Appointment[];
  submissions: Submission[];
  onApproveAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onSubmitFeedback: (subId: string, text: string, score: number) => void;
  onForwardCase: (patientName: string, reason: string) => void;
}

export default function SpecialistDashboard({
  specialist,
  appointments,
  submissions,
  onApproveAppointment,
  onCancelAppointment,
  onSubmitFeedback,
  onForwardCase
}: SpecialistDashboardProps) {
  const [activeTab, setActiveTab] = useState<"consultations" | "assignments" | "availability">("consultations");

  // State for session notes and submission review
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({});
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, { text: string; score: number }>>({});
  const [showForwardModal, setShowForwardModal] = useState<string | null>(null);
  const [forwardReason, setForwardReason] = useState("");

  // Specialist availability slots state
  const [availSlots, setAvailSlots] = useState<string[]>([
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM"
  ]);
  const [newSlot, setNewSlot] = useState("");

  const handleAddSlot = () => {
    if (newSlot.trim() && !availSlots.includes(newSlot)) {
      setAvailSlots((prev) => [...prev, newSlot.trim()]);
      setNewSlot("");
    }
  };

  const handleRemoveSlot = (slot: string) => {
    setAvailSlots((prev) => prev.filter((s) => s !== slot));
  };

  const handleSaveNotes = (id: string) => {
    alert(`Clinical notes for appointment ${id} saved successfully.`);
  };

  // Filter appointments specifically for this specialist
  const specAppts = appointments.filter((a) => a.specialistId === specialist.id);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white border border-surface-container rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-zen">
        <div className="flex items-center gap-4">
          <img 
            src={specialist.avatarUrl} 
            alt={specialist.fullName} 
            className="w-16 h-16 rounded-full object-cover border border-surface-container"
          />
          <div>
            <span className="text-xs text-secondary font-mono uppercase tracking-widest">Specialist Workspace</span>
            <h2 className="text-2xl font-bold text-deep-pine leading-tight">{specialist.fullName}</h2>
            <p className="text-body-md text-secondary mt-0.5">{specialist.qualification}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("consultations")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "consultations" ? "bg-deep-pine text-white" : "bg-surface-container text-secondary hover:text-deep-pine"
            }`}
          >
            <Calendar size={14} />
            <span>Consultations ({specAppts.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab("assignments")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "assignments" ? "bg-deep-pine text-white" : "bg-surface-container text-secondary hover:text-deep-pine"
            }`}
          >
            <FileText size={14} />
            <span>Review Tasks ({submissions.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab("availability")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "availability" ? "bg-deep-pine text-white" : "bg-surface-container text-secondary hover:text-deep-pine"
            }`}
          >
            <Users size={14} />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white border border-surface-container rounded-[2rem] p-6 md:p-10 shadow-soft-zen min-h-[400px]">
        
        {/* consultations Tab */}
        {activeTab === "consultations" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <h3 className="text-lg font-bold text-deep-pine">Upcoming Bookings & Consultations</h3>
              <span className="text-xs text-secondary font-medium">Auto-synced with Google Calendar API</span>
            </div>

            {specAppts.length === 0 ? (
              <div className="text-center py-12 text-secondary">No appointment bookings scheduled at this time.</div>
            ) : (
              <div className="space-y-6">
                {specAppts.map((appt) => (
                  <div key={appt.id} className="border border-surface-container rounded-2xl p-6 space-y-4 bg-background">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-secondary uppercase font-mono tracking-wider">Patient Name</span>
                        <h4 className="text-lg font-bold text-deep-pine mt-0.5">{appt.patientName || "Elena Rostova"}</h4>
                        <div className="flex items-center gap-3 text-xs text-secondary font-medium mt-1">
                          <span>Date: <span className="text-deep-pine font-semibold">{appt.appointmentDate}</span></span>
                          <span>•</span>
                          <span>Time: <span className="text-deep-pine font-semibold">{appt.appointmentTime}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {appt.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApproveAppointment(appt.id)}
                              className="px-4 py-2 bg-deep-pine hover:bg-primary text-white text-xs font-semibold uppercase tracking-wide rounded-full flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 size={12} />
                              <span>Approve Slot</span>
                            </button>
                            <button
                              onClick={() => onCancelAppointment(appt.id)}
                              className="px-4 py-2 bg-surface-container text-secondary hover:text-red-500 text-xs font-semibold uppercase tracking-wide rounded-full flex items-center gap-1"
                            >
                              <XCircle size={12} />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {appt.status === "approved" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-mint-accent bg-mint-accent/15 px-3 py-1 rounded-full">
                              Approved & Active
                            </span>
                            <a 
                              href={appt.meetingLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-4 py-2 bg-mint-accent text-primary text-xs font-semibold uppercase tracking-wide rounded-full flex items-center gap-1.5 hover:opacity-90 shadow-sm"
                            >
                              <Video size={12} />
                              <span>Join Room</span>
                            </a>
                            <button
                              onClick={() => setShowForwardModal(appt.patientName || "Patient")}
                              className="px-3 py-2 bg-surface-container text-secondary hover:text-deep-pine text-xs font-semibold rounded-full flex items-center gap-1"
                              title="Escalate or refer this patient case"
                            >
                              <ArrowUpRight size={12} />
                              <span>Refer</span>
                            </button>
                          </div>
                        )}

                        {appt.status === "cancelled" && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>

                    {appt.status === "approved" && (
                      <div className="pt-4 border-t border-surface-container/60 space-y-3">
                        <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">
                          Private Consultation & Care Notes
                        </label>
                        <div className="flex gap-3">
                          <textarea
                            value={sessionNotes[appt.id] || ""}
                            onChange={(e) => setSessionNotes({ ...sessionNotes, [appt.id]: e.target.value })}
                            placeholder="Document observations, therapeutic exercises, and progress logs during the session..."
                            className="flex-1 text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none focus:ring-1 focus:ring-therapeutic-terracotta placeholder-secondary/50"
                            rows={2}
                          />
                          <button
                            onClick={() => handleSaveNotes(appt.id)}
                            className="bg-deep-pine text-white px-4 rounded-xl flex items-center justify-center hover:bg-primary transition-all duration-300"
                            title="Save clinical records"
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <h3 className="text-lg font-bold text-deep-pine">Submitted Homework Exercises & Logs</h3>
              <span className="text-xs text-secondary font-medium">Pending grading and feedback responses</span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-secondary">All homework logs reviewed! No pending submissions.</div>
            ) : (
              <div className="space-y-6">
                {submissions.map((sub) => (
                  <div key={sub.id} className="border border-surface-container rounded-2xl p-6 space-y-4 bg-background">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <span className="inline-block bg-sage-calm/50 text-deep-pine px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">
                          {sub.assignmentTitle}
                        </span>
                        <h4 className="text-lg font-bold text-deep-pine mt-1.5">{sub.patientName}</h4>
                        <p className="text-xs text-secondary font-medium mt-0.5">Submitted: {sub.submissionTime}</p>
                      </div>

                      <div>
                        {sub.status === "reviewed" ? (
                          <span className="text-xs font-semibold uppercase tracking-wider text-mint-accent bg-mint-accent/15 px-3 py-1 rounded-full flex items-center gap-1">
                            <Check size={12} />
                            <span>Reviewed & Sent</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wider text-therapeutic-terracotta bg-therapeutic-terracotta/15 px-3 py-1 rounded-full">
                            Pending Evaluation
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-surface-container text-body-md text-on-surface-variant leading-relaxed">
                      <p className="font-semibold text-deep-pine mb-1 text-xs uppercase tracking-wider">Patient Self-Observation & Logs:</p>
                      <p className="italic">"{sub.observation}"</p>
                      {sub.uploadedFile && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-deep-pine">
                          <span className="underline cursor-pointer hover:text-therapeutic-terracotta">📂 Download {sub.uploadedFile}</span>
                        </div>
                      )}
                    </div>

                    {sub.status !== "reviewed" && (
                      <div className="pt-4 border-t border-surface-container/60 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider mb-2">
                              Provide Warm, Actionable Feedback
                            </label>
                            <textarea
                              value={feedbackInputs[sub.id]?.text || ""}
                              onChange={(e) => setFeedbackInputs({
                                ...feedbackInputs,
                                [sub.id]: {
                                  text: e.target.value,
                                  score: feedbackInputs[sub.id]?.score || 5
                                }
                              })}
                              placeholder="Validate their effort, identify insights, and guide their next steps clearly..."
                              className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none focus:ring-1 focus:ring-therapeutic-terracotta placeholder-secondary/50"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider mb-2">
                              Rating Score
                            </label>
                            <select
                              value={feedbackInputs[sub.id]?.score || 5}
                              onChange={(e) => setFeedbackInputs({
                                ...feedbackInputs,
                                [sub.id]: {
                                  text: feedbackInputs[sub.id]?.text || "",
                                  score: Number(e.target.value)
                                }
                              })}
                              className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white focus:outline-none"
                            >
                              <option value="5">5/5 - Perfect effort</option>
                              <option value="4">4/5 - Excellent focus</option>
                              <option value="3">3/5 - Good progress</option>
                              <option value="2">2/5 - Needs effort</option>
                              <option value="1">1/5 - Incomplete</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              const input = feedbackInputs[sub.id];
                              if (!input || !input.text.trim()) {
                                alert("Please type your feedback content before sending.");
                                return;
                              }
                              onSubmitFeedback(sub.id, input.text, input.score);
                            }}
                            className="bg-deep-pine text-white hover:bg-primary font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
                          >
                            Submit Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* availability Tab */}
        {activeTab === "availability" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <h3 className="text-lg font-bold text-deep-pine">Configure Consultation Availability Hours</h3>
              <span className="text-xs text-secondary font-medium">Sets the live slots patients browse in the directory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Slot list */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-deep-pine uppercase tracking-widest">Active Standard Slots</h4>
                <div className="space-y-2">
                  {availSlots.map((slot) => (
                    <div key={slot} className="flex justify-between items-center bg-background px-4 py-3 rounded-xl border border-surface-container">
                      <span className="text-body-md font-semibold text-deep-pine font-mono">{slot}</span>
                      <button 
                        onClick={() => handleRemoveSlot(slot)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add slot form */}
              <div className="bg-background p-6 rounded-2xl border border-surface-container space-y-4 h-fit">
                <h4 className="text-sm font-semibold text-deep-pine uppercase tracking-widest">Add New Slot</h4>
                <div className="space-y-3">
                  <input 
                    type="text"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    placeholder="e.g. 11:30 AM - 12:30 PM"
                    className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 bg-white placeholder-secondary/50 focus:outline-none"
                  />
                  <button 
                    onClick={handleAddSlot}
                    className="w-full bg-deep-pine hover:bg-primary text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add Availability Slot</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-secondary pt-2">
                  <ShieldCheck size={14} className="text-mint-accent" />
                  <span>Updates immediately in patient directory slots.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Forwarding Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-[2rem] p-6 shadow-2xl space-y-4 border border-surface-container relative">
            <h3 className="text-lg font-bold text-deep-pine flex items-center gap-1.5">
              <AlertTriangle className="text-therapeutic-terracotta" size={18} />
              <span>Forward Case to Senior Specialist</span>
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Refer patient <span className="font-semibold text-deep-pine">{showForwardModal}</span>'s profile metrics, assessment histories, and clinical logs to an approved senior consultant for specialized escalation or therapeutic alignment.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider">Reason for Referral</label>
              <textarea
                value={forwardReason}
                onChange={(e) => setForwardReason(e.target.value)}
                placeholder="e.g. Signs of severe somatic fatigue accompanied by acute panic episodes. Requires clinical treatment escalation..."
                className="w-full text-body-md text-deep-pine border border-surface-container rounded-xl p-3 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForwardModal(null);
                  setForwardReason("");
                }}
                className="px-4 py-2 text-xs font-semibold text-secondary hover:text-deep-pine bg-surface-container rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!forwardReason.trim()) {
                    alert("Please state a clinical referral reason.");
                    return;
                  }
                  onForwardCase(showForwardModal, forwardReason);
                  setShowForwardModal(null);
                  setForwardReason("");
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-therapeutic-terracotta rounded-full shadow-md hover:opacity-90"
              >
                Refer Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
