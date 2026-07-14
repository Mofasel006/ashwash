import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BreathingExercise() {
  const [isActive, setIsState] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Rest");
  const [timer, setTimer] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [muted, setMuted] = useState(true);

  // Setup standard 4-7-8 breathing cycles
  // Inhale: 4s, Hold: 7s, Exhale: 8s
  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const nextVal = prev + 1;

          if (phase === "Rest") {
            setPhase("Inhale");
            return 1;
          }

          if (phase === "Inhale" && nextVal > 4) {
            setPhase("Hold");
            if (!muted) playBeep(520, 0.2); // Soft warm tone
            return 1;
          }

          if (phase === "Hold" && nextVal > 7) {
            setPhase("Exhale");
            if (!muted) playBeep(392, 0.25);
            return 1;
          }

          if (phase === "Exhale" && nextVal > 8) {
            setPhase("Inhale");
            setBreathCount((c) => c + 1);
            if (!muted) playBeep(440, 0.15);
            return 1;
          }

          return nextVal;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, muted]);

  // Gentle synthesizer note helper so it actually plays real ambient sound if requested
  const playBeep = (freq: number, duration: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext block by browser auto-play policy");
    }
  };

  const handleStart = () => {
    setIsState(true);
    setPhase("Inhale");
    setTimer(1);
    if (!muted) playBeep(440, 0.25);
  };

  const handlePause = () => {
    setIsState(false);
  };

  const handleReset = () => {
    setIsState(false);
    setPhase("Rest");
    setTimer(0);
    setBreathCount(0);
  };

  // Determine size multiplier for the pulsing shape
  let scale = 1.0;
  let bgGradient = "from-sage-calm/30 to-sage-calm/10";
  let promptText = "Take a moment to prepare. Click Start below.";

  if (isActive) {
    if (phase === "Inhale") {
      scale = 1.0 + (timer / 4) * 0.5; // Swells up to 1.5
      bgGradient = "from-mint-accent/20 to-sage-calm/30";
      promptText = `Slowly inhale deep into your belly... (${timer}/4s)`;
    } else if (phase === "Hold") {
      scale = 1.5; // Stays fully open
      bgGradient = "from-therapeutic-terracotta/20 to-sage-calm/30";
      promptText = `Suspend your breath. Find absolute quiet. (${timer}/7s)`;
    } else if (phase === "Exhale") {
      scale = 1.5 - (timer / 8) * 0.5; // Shrinks down to 1.0
      bgGradient = "from-secondary-container to-sage-calm/10";
      promptText = `Slowly release all tension through pursed lips... (${timer}/8s)`;
    }
  }

  return (
    <div className="bg-alabaster-base border border-white/60 p-8 rounded-[2rem] shadow-soft-zen flex flex-col items-center max-w-lg mx-auto w-full relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 hover:bg-surface-container rounded-full text-secondary hover:text-deep-pine transition-all"
          title={muted ? "Enable audio guidance" : "Mute audio guidance"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="flex items-center gap-2 bg-sage-calm/30 text-deep-pine px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
        <Heart size={14} className="animate-pulse text-therapeutic-terracotta" />
        <span>SOMA-REGULATION ENGINE</span>
      </div>

      {/* Visual Breathing Ring */}
      <div className="relative h-64 w-full flex items-center justify-center mb-8">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={phase}
            className={`absolute w-44 h-44 rounded-full bg-gradient-to-b ${bgGradient} blur-xs shadow-ultra-soft`}
            animate={{
              scale: scale,
              borderRadius: phase === "Inhale" 
                ? "40% 60% 70% 30% / 40% 50% 60% 50%" 
                : phase === "Hold" 
                ? "50% 50% 30% 70% / 50% 40% 60% 50%" 
                : "30% 70% 50% 50% / 60% 50% 50% 40%",
            }}
            transition={{
              duration: phase === "Hold" ? 0.3 : 1.0,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>

        {/* Core timing display */}
        <div className="z-10 text-center flex flex-col items-center">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline-md text-headline-md text-deep-pine font-medium"
          >
            {phase}
          </motion.span>
          {timer > 0 && (
            <motion.span
              key={timer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-deep-pine font-mono mt-1"
            >
              {timer}s
            </motion.span>
          )}
        </div>
      </div>

      {/* Instructions & Statistics */}
      <div className="text-center mb-8 h-16 flex items-center justify-center px-4">
        <p className="text-body-md text-on-surface-variant max-w-sm italic leading-relaxed">
          {promptText}
        </p>
      </div>

      <div className="flex items-center gap-6 justify-between w-full border-t border-surface-container pt-6">
        <div className="flex flex-col items-start">
          <span className="text-xs text-secondary uppercase tracking-widest">Completed Cycles</span>
          <span className="text-2xl font-bold text-deep-pine font-mono mt-0.5">{breathCount}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {isActive ? (
            <button
              onClick={handlePause}
              className="w-12 h-12 rounded-full bg-deep-pine text-white flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-md"
            >
              <Pause size={20} />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="w-12 h-12 rounded-full bg-therapeutic-terracotta text-white flex items-center justify-center hover:opacity-90 transition-all duration-300 shadow-md"
            >
              <Play size={20} className="ml-1" />
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full bg-surface-container text-secondary flex items-center justify-center hover:text-deep-pine transition-all duration-300"
            title="Reset exercise"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-secondary text-xs">
        <ShieldCheck size={14} className="text-mint-accent" />
        <span>Grounds the vagus nerve to immediately reduce acute distress.</span>
      </div>
    </div>
  );
}
