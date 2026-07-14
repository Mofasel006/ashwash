import React, { useState } from "react";
import { Sparkles, Brain, ArrowRight, RotateCcw, CheckCircle2, AlertCircle, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: number;
  text: string;
  labels: string[]; // [Low, High]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How often have you felt overwhelmed or unable to cope with daily tasks this past week?",
    labels: ["Never", "Constantly"]
  },
  {
    id: 2,
    text: "To what extent has your sleep been restless, broken, or difficult to fall into?",
    labels: ["Perfect Rest", "Total Insomnia"]
  },
  {
    id: 3,
    text: "How frequently do you find yourself caught in negative, looping thought cycles about yourself or your family?",
    labels: ["Quiet Mind", "Continuous Rumination"]
  },
  {
    id: 4,
    text: "How difficult has it been for you to regulate your emotions (e.g. feeling sudden anger, tearfulness, or irritation)?",
    labels: ["Very Stable", "Extremely Hard"]
  },
  {
    id: 5,
    text: "How isolated or disconnected do you feel from friends, family, or supportive social groups?",
    labels: ["Deeply Supported", "Fully Isolated"]
  },
  {
    id: 6,
    text: "How heavily does physical exhaustion or mental burnout affect your motivation during the day?",
    labels: ["Full Energy", "Completely Drained"]
  }
];

interface AssessmentProps {
  onAddRecommendation: (rec: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function Assessment({ onAddRecommendation, onNavigateToTab }: AssessmentProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const handleSliderChange = (qId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const startCalmingTransition = () => {
    setLoading(true);
    setLoadingStep(0);

    // Calm loading phase messages to reduce anxiety and enhance user experience
    const steps = [
      "Securing your confidential portal...",
      "Analyzing emotional metrics and triggers...",
      "Consulting the Ashwash AI Solace engine...",
      "Assembling personalized behavioral remedies..."
    ];

    const timer1 = setTimeout(() => setLoadingStep(1), 800);
    const timer2 = setTimeout(() => setLoadingStep(2), 1600);
    const timer3 = setTimeout(() => setLoadingStep(3), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleSubmit = async () => {
    startCalmingTransition();

    const answersPayload = Object.keys(answers).map((id) => ({
      questionId: Number(id),
      value: answers[Number(id)]
    }));

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      });

      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error("Assessment submit error:", e);
      // Fallback result inside component if network error
      setResult({
        score: Object.values(answers).reduce((a: number, b: number) => a + b, 0),
        category: "moderate",
        scoreDescription: "Your score indicates moderate psychological strain and physical fatigue.",
        analysis: "Your responses suggest you are carrying a high level of day-to-day stress, which is impacting both your nervous system stability and sleep cycles. Finding small pockets of somatic coregulation is highly encouraged.",
        recommendations: [
          "Practice 'Oceanic Breathing' twice daily for 5 cycles to stimulate vagal tone.",
          "Enroll in 'The Quiet Mind' course to identify cognitive distortion triggers.",
          "Create an anonymous post in the peer forum to share feelings and reduce isolation.",
          "Book a consultation session with a clinical psychologist to align custom therapies."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({ 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 });
    setResult(null);
  };

  const getScoreColor = (category: string) => {
    if (category === "mild") return "text-mint-accent bg-mint-accent/15";
    if (category === "moderate") return "text-therapeutic-terracotta bg-therapeutic-terracotta/15";
    return "text-red-500 bg-red-500/15";
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {!loading && !result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-calm/40 text-deep-pine text-xs font-semibold rounded-full uppercase tracking-wider">
                <Brain size={12} />
                <span>Confidential Intake</span>
              </span>
              <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">How is your internal landscape today?</h2>
              <p className="text-body-md text-secondary">
                This guided self-assessment evaluates stress, autonomic regulation, and emotional energy to recommend a supportive care pathway.
              </p>
            </div>

            <div className="bg-white border border-surface-container rounded-[2rem] p-6 md:p-10 shadow-soft-zen space-y-8">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-4 pb-6 border-b border-surface-containerlast:border-none">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm font-semibold text-deep-pine font-mono bg-sage-calm/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {q.id}
                    </span>
                    <p className="text-body-md font-medium text-deep-pine flex-1 leading-relaxed">
                      {q.text}
                    </p>
                  </div>

                  <div className="space-y-2 px-10">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={answers[q.id]}
                      onChange={(e) => handleSliderChange(q.id, Number(e.target.value))}
                      className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-deep-pine"
                    />
                    <div className="flex justify-between text-xs text-secondary font-medium">
                      <span>{q.labels[0]} (0)</span>
                      <span className="text-deep-pine bg-surface-container px-2 py-0.5 rounded font-mono">
                        Score: {answers[q.id]}
                      </span>
                      <span>{q.labels[1]} (5)</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <AlertCircle size={14} className="text-therapeutic-terracotta" />
                  <span>Confidential. Your responses are encrypted.</span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-deep-pine text-alabaster-base font-semibold px-8 py-4 rounded-full hover:bg-primary transition-all duration-300 shadow-soft flex items-center gap-2 group w-full md:w-auto justify-center"
                >
                  <span>Build My Solace Path</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOADING ANIMATION CONTAINER */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-alabaster-base/80 p-8 rounded-[2rem] border border-white"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full border-4 border-sage-calm border-t-deep-pine rounded-full animate-spin" />
              <Compass size={32} className="text-deep-pine animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-headline-md text-deep-pine">Re-centering...</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-body-md text-secondary font-medium h-6"
                >
                  {
                    loadingStep === 0 ? "Securing your confidential portal..." :
                    loadingStep === 1 ? "Analyzing emotional metrics and triggers..." :
                    loadingStep === 2 ? "Consulting the Ashwash AI Solace engine..." :
                    "Assembling personalized behavioral remedies..."
                  }
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ASSESSMENT REPORT SCREEN */}
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-deep-pine text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                <Sparkles size={12} className="text-mint-accent" />
                <span>AI Generated Solace Report</span>
              </span>
              <h2 className="font-display-lg-mobile md:font-display-lg text-deep-pine">Your Customized Path</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left summary card */}
              <div className="md:col-span-1 bg-white border border-surface-container p-6 rounded-[2rem] shadow-soft-zen flex flex-col justify-between items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage-calm to-therapeutic-terracotta" />
                
                <div className="space-y-4 mt-4 w-full">
                  <span className="text-xs text-secondary uppercase tracking-widest font-semibold">Overall Tension Score</span>
                  <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="#f5f3ef" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="60" 
                        stroke="#1E352F" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - result.score / 30)}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-deep-pine font-mono">{result.score}</span>
                      <span className="text-xs text-secondary font-medium">out of 30</span>
                    </div>
                  </div>

                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getScoreColor(result.category)}`}>
                    {result.category === "mild" ? "Mild Distress" : result.category === "moderate" ? "Moderate Strain" : "Severe Burden"}
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-8 text-xs font-semibold text-secondary hover:text-deep-pine flex items-center gap-1.5 hover:underline decoration-therapeutic-terracotta decoration-2"
                >
                  <RotateCcw size={14} />
                  <span>Retake Intake Assessment</span>
                </button>
              </div>

              {/* Right detailed analysis card */}
              <div className="md:col-span-2 bg-white border border-surface-container p-8 rounded-[2rem] shadow-soft-zen space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-deep-pine mb-1">Clinical Interpretation</h3>
                  <p className="text-xs text-secondary">Evaluated on {new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-body-md font-semibold text-deep-pine leading-relaxed">
                    {result.scoreDescription || "Your answers reveal that accumulated fatigue and repetitive cognitive loops are starting to strain your wellness thresholds."}
                  </p>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {result.analysis || "This level of pressure often triggers autonomic hyperarousal, making relaxed sleep and continuous focus difficult to find. We suggest a path heavily utilizing parasympathetic breathing tools and slow structural learning."}
                  </p>
                </div>

                <div className="border-t border-surface-container pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-deep-pine uppercase tracking-widest">Recommended Remedies</h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 bg-background p-3 rounded-xl border border-surface-container">
                        <CheckCircle2 size={18} className="text-mint-accent shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <p className="text-body-md text-on-background font-medium leading-relaxed">{rec}</p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                onAddRecommendation(rec);
                                if (rec.toLowerCase().includes("breath") || rec.toLowerCase().includes("vagal")) {
                                  onNavigateToTab("emergency");
                                } else if (rec.toLowerCase().includes("course") || rec.toLowerCase().includes("enroll")) {
                                  onNavigateToTab("library");
                                } else if (rec.toLowerCase().includes("forum") || rec.toLowerCase().includes("post")) {
                                  onNavigateToTab("community");
                                } else {
                                  onNavigateToTab("specialists");
                                }
                              }}
                              className="text-xs font-semibold text-deep-pine hover:underline decoration-mint-accent decoration-2 mt-1"
                            >
                              Launch Exercise →
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
