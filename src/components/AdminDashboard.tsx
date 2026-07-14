import React, { useState } from "react";
import { User, Course, CommunityPost, Payment } from "../types";
import { 
  ShieldCheck, ShieldAlert, BookOpen, CreditCard, Flag, FileSpreadsheet, 
  Trash2, ToggleLeft, ToggleRight, Check, Save, Download, Search, AlertCircle 
} from "lucide-react";

interface AdminDashboardProps {
  users: User[];
  courses: Course[];
  posts: CommunityPost[];
  onToggleUserStatus: (id: string) => void;
  onApproveCourse: (id: string) => void;
  onUpdateSubscriptionPrice: (id: string, price: number) => void;
  onDeletePost: (id: string) => void;
}

export default function AdminDashboard({
  users,
  courses,
  posts,
  onToggleUserStatus,
  onApproveCourse,
  onUpdateSubscriptionPrice,
  onDeletePost
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"members" | "courses" | "plans" | "posts" | "reports">("members");
  const [searchTerm, setSearchTerm] = useState("");

  // Subscriptions price state locally
  const [tierPrices, setTierPrices] = useState<Record<string, number>>({
    "course-3": 15,
    "course-4": 12
  });

  const handlePriceChange = (id: string, price: number) => {
    setTierPrices((prev) => ({ ...prev, [id]: price }));
    onUpdateSubscriptionPrice(id, price);
  };

  const filteredUsers = users.filter((u) => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Title Info */}
      <div className="bg-white border border-surface-container rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-zen">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-deep-pine text-white flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xs text-secondary font-mono uppercase tracking-widest">Administrator Controls</span>
            <h2 className="text-2xl font-bold text-deep-pine leading-tight">System Administration</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["members", "courses", "plans", "posts", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-deep-pine text-white" : "bg-surface-container text-secondary hover:text-deep-pine"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CORE DISPLAY WINDOW */}
      <div className="bg-white border border-surface-container rounded-[2rem] p-6 md:p-10 shadow-soft-zen min-h-[400px]">
        
        {/* members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap border-b border-surface-container pb-4">
              <div>
                <h3 className="text-lg font-bold text-deep-pine">Registered Platform Members</h3>
                <p className="text-xs text-secondary">Manage access privileges, verify licenses, and toggle bans</p>
              </div>

              {/* Search */}
              <div className="relative w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-background border-none pl-9 pr-4 py-2 rounded-full text-xs text-deep-pine placeholder-secondary focus:ring-1 focus:ring-therapeutic-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-md">
                <thead>
                  <tr className="border-b border-surface-container text-xs text-secondary uppercase font-semibold">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Life Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-background/40">
                      <td className="py-3.5 px-4 font-semibold text-deep-pine">
                        <div>
                          <p>{user.fullName}</p>
                          <p className="text-xs font-normal text-secondary">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs uppercase text-deep-pine">{user.role}</td>
                      <td className="py-3.5 px-4 text-secondary text-xs">{user.lifeCategory || "Standard"}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                          user.status === "active" ? "bg-mint-accent/15 text-primary" : "bg-red-500/15 text-red-500"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onToggleUserStatus(user.id)}
                          className="text-xs font-semibold px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-all"
                        >
                          {user.status === "active" ? "Suspend Account" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <div>
                <h3 className="text-lg font-bold text-deep-pine">Compliance & Course Approval Queue</h3>
                <p className="text-xs text-secondary">Verify compliance with clinical safety standards prior to storefront publication</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="border border-surface-container rounded-2xl p-6 bg-background space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="bg-sage-calm/50 text-deep-pine px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono">
                      {course.category}
                    </span>
                    <h4 className="text-lg font-bold text-deep-pine mt-2">{course.title}</h4>
                    <p className="text-body-md text-on-surface-variant line-clamp-3 mt-1.5 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="pt-4 border-t border-surface-container/60 flex justify-between items-center">
                    <div className="text-xs text-secondary">
                      <span>{course.duration}</span>
                      <span className="mx-2">•</span>
                      <span>Rating: {course.rating}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-mint-accent bg-mint-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                        Published
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hardcoded pre-seeded Draft Course */}
              <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 bg-white space-y-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-therapeutic-terracotta/20 text-therapeutic-terracotta text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Draft Submission
                </div>

                <div>
                  <span className="bg-surface-container text-secondary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono">
                    Depression Relief
                  </span>
                  <h4 className="text-lg font-bold text-deep-pine mt-2">Reclaiming Joy</h4>
                  <p className="text-body-md text-on-surface-variant line-clamp-3 mt-1.5 leading-relaxed">
                    A clinical step-by-step cognitive behavioral draft course focusing on mild-to-moderate depression, behavioral activation scheduling, and finding fulfillment.
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-container/60 flex justify-between items-center">
                  <div className="text-xs text-secondary">
                    <span>15 Sessions</span>
                    <span className="mx-2">•</span>
                    <span>Author: Dr. Sarah Jenkins</span>
                  </div>

                  <button
                    onClick={() => {
                      alert("Reclaiming Joy draft approved! The course has been parsed, verified against content guidelines, and published to the public list.");
                    }}
                    className="px-4 py-2 bg-deep-pine text-white hover:bg-primary font-semibold text-xs uppercase tracking-wide rounded-full shadow-sm"
                  >
                    Approve Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* plans Tab */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <div>
                <h3 className="text-lg font-bold text-deep-pine">Pricing Tiers & Subscription Plans</h3>
                <p className="text-xs text-secondary">Manage premium resource price thresholds and checkout permissions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.filter(c => c.isPremium).map((course) => (
                <div key={course.id} className="border border-surface-container bg-background p-6 rounded-2xl space-y-4">
                  <span className="bg-therapeutic-terracotta/15 text-therapeutic-terracotta px-2.5 py-1 rounded-full text-xs uppercase font-bold tracking-wide">
                    Premium Resource
                  </span>
                  <h4 className="text-lg font-bold text-deep-pine mt-1">{course.title}</h4>
                  <p className="text-body-md text-secondary line-clamp-2">{course.description}</p>

                  <div className="pt-4 border-t border-surface-container/60 flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-deep-pine uppercase tracking-wider mb-1.5">Configure Price ($)</label>
                      <input 
                        type="number"
                        value={tierPrices[course.id]}
                        onChange={(e) => handlePriceChange(course.id, Number(e.target.value))}
                        className="w-full bg-white border border-surface-container rounded-xl px-3 py-2 text-sm text-deep-pine font-semibold focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => alert(`Pricing tier updated to $${tierPrices[course.id]} successfully. Synchronized with financial payment gateway.`)}
                      className="mt-5 px-4 py-2.5 bg-deep-pine hover:bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <Save size={12} />
                      <span>Sync Price</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-surface-container pb-4">
              <div>
                <h3 className="text-lg font-bold text-deep-pine">Anonymous Community Moderation Queue</h3>
                <p className="text-xs text-secondary">Moderate flagged forum posts to maintain safe peer support environments</p>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12 text-secondary">Moderation queue is empty! Safe environment confirmed.</div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-surface-container bg-background rounded-xl p-5 flex items-start gap-4 justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono bg-surface-container px-2 py-0.5 rounded text-deep-pine">
                          {post.isAnonymous ? "Anonymous User" : post.patientName}
                        </span>
                        <span className="text-[10px] text-secondary font-mono">{post.createdAt}</span>
                      </div>
                      <p className="text-body-md text-deep-pine italic leading-relaxed">"{post.content}"</p>
                    </div>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all shrink-0"
                      title="Remove non-compliant post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6 text-center max-w-md mx-auto py-8">
            <div className="w-16 h-16 bg-sage-calm/30 rounded-full flex items-center justify-center text-deep-pine mx-auto mb-4">
              <FileSpreadsheet size={28} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-deep-pine">Export System Reports & Analytics</h3>
              <p className="text-body-md text-secondary leading-relaxed">
                Assembles platform diagnostic parameters, assessment records, mood logs, and transaction invoices into a certified spreadsheet.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={() => alert("Platform telemetry and enrollment analytics exported as CSV.")}
                className="px-6 py-3 bg-surface-container text-deep-pine hover:bg-surface-container-high font-semibold text-xs uppercase tracking-wider rounded-full flex items-center gap-2"
              >
                <Download size={14} />
                <span>Export CSV Report</span>
              </button>
              <button
                onClick={() => alert("Confidential psychological intake records generated as certified PDF.")}
                className="px-6 py-3 bg-deep-pine hover:bg-primary text-white font-semibold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 shadow-md"
              >
                <Download size={14} />
                <span>Export Clinical PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-secondary justify-center pt-6">
              <AlertCircle size={12} className="text-therapeutic-terracotta" />
              <span>Restricted. System audits recorded in local secure logs.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
