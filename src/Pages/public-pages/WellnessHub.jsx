import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Users,
  Sparkles,
  HeartPulse,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";

export const WellnessHub = () => {
  // Extended affirmations
  const affirmations = [
    "You are enough, just as you are 💙",
    "Small steps every day create big change 🌱",
    "Peace begins with a deep breath 🌿",
    "Your feelings are valid. Your story matters ✨",
    "Choose progress, not perfection 🌞",
    "You are stronger than you think 💪",
    "Your kindness makes the world brighter 🌍",
    "Resting is also progress 💤",
    "Your future is full of possibilities 🌈",
    "Every day is a fresh start 🌅",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % affirmations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [affirmations.length]);

  // Manual navigation
  const handlePrev = () => {
    setCurrentQuote((prev) =>
      prev === 0 ? affirmations.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentQuote((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="min-h-screen w-full px-6 sm:px-12 md:px-20 py-20 pt-32 max-w-screen-xl mx-auto space-y-28">
        {/* Page Heading */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
            Your Wellness Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Explore wellness tips, inspiring affirmations, and discover what’s
            coming next on your mental health journey with MindMitra.
          </p>
        </header>

        {/* Wellness Tips Section */}
        <motion.section
          role="region"
          aria-label="Wellness Tips and Practices"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            🌿 Wellness Tips & Practices
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <HeartPulse className="w-10 h-10 text-red-500" />,
                title: "Stay Active",
                desc: "A 10-minute walk can boost your mood instantly.",
              },
              {
                icon: <Coffee className="w-10 h-10 text-amber-800" />,
                title: "Mindful Breaks",
                desc: "Pause with a tea/coffee and breathe deeply.",
              },
              {
                icon: <Sun className="w-10 h-10 text-yellow-500" />,
                title: "Morning Light",
                desc: "Expose yourself to sunlight to boost energy.",
              },
              {
                icon: <Moon className="w-10 h-10 text-indigo-500" />,
                title: "Sleep Routine",
                desc: "Stick to a consistent bedtime for better rest.",
              },
              {
                icon: <Sparkles className="w-10 h-10 text-purple-500" />,
                title: "Gratitude Practice",
                desc: "Write 3 things you’re grateful for daily.",
              },
              {
                icon: <Users className="w-10 h-10 text-green-500" />,
                title: "Connect",
                desc: "Spend time with friends or loved ones.",
              },
            ].map((tip) => (
              <motion.article
                key={tip.title}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4" aria-hidden="true">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.desc}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Daily Affirmations */}
        <motion.section
          role="region"
          aria-label="Daily Affirmations"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-center text-white relative"
        >
          <h2 className="text-3xl font-bold mb-6">💡 Daily Affirmation</h2>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous affirmation"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40 transition"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next affirmation"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40 transition"
          >
            <ArrowRight className="w-6 h-6" aria-hidden="true" />
          </button>

          <motion.p
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-semibold min-h-[60px]"
            aria-live="polite"
          >
            {affirmations[currentQuote]}
          </motion.p>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {affirmations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuote(i)}
                aria-label={`Go to affirmation ${i + 1}`}
                aria-current={i === currentQuote ? "true" : "false"}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentQuote ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.section>

        {/* Upcoming Features */}
        <motion.section
          role="region"
          aria-label="Upcoming Features"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            🚀 Upcoming Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="w-10 h-10 text-blue-500" />,
                title: "Peer Support Circles",
                desc: "Group sessions with people who understand.",
              },
              {
                icon: <Shield className="w-10 h-10 text-red-500" />,
                title: "Emergency SOS",
                desc: "Quick connect to hotlines & professionals.",
              },
              {
                icon: <Sparkles className="w-10 h-10 text-purple-500" />,
                title: "AI Personal Coach",
                desc: "Personalized guidance on goals & growth.",
              },
            ].map((feature) => (
              <motion.article
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>
    </section>
  );
};
