import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, Shield, Brain } from "lucide-react";

export const Home = () => {
  return (
    <main
      id="home"
      className="bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900"
    >
      <div className="min-h-screen w-full px-6 sm:px-12 mt-20 md:px-20 py-20 pt-32 flex items-center justify-center">
        <div className="flex flex-col w-full max-w-screen-xl space-y-24">
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
          >
            {/* Text */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                The best way to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
                  take care of your mind
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto lg:mx-0">
                MindMitra is your AI-powered companion for{" "}
                <span className="font-semibold text-blue-600">
                  mental health
                </span>{" "}
                — available 24x7 to listen, support, and guide you.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
                <Link
                  to="/chat"
                  aria-label="Start free chat with MindMitra"
                  className="bg-blue-600 hover:bg-blue-700 transition duration-300 px-8 py-3 rounded-xl font-semibold text-white shadow-md text-lg"
                >
                  Try for Free
                </Link>
                <Link
                  to="/about"
                  aria-label="Learn how MindMitra works"
                  className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition duration-300 px-8 py-3 rounded-xl font-semibold text-lg"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center"
            >
              <img
                src="/People.png"
                alt="Illustration of people connecting with MindMitra chatbot"
                className="w-48 sm:w-72 md:w-96 h-auto object-contain hover:scale-105 transition-transform duration-500 drop-shadow-xl"
              />
            </motion.div>
          </motion.header>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            aria-label="Key features of MindMitra"
          >
            {[
              {
                icon: <Heart aria-hidden="true" className="w-10 h-10 text-pink-500" />,
                title: "Safe Space",
                desc: "Share openly without fear of judgment.",
              },
              {
                icon: <Brain aria-hidden="true" className="w-10 h-10 text-indigo-500" />,
                title: "Smart Support",
                desc: "Guided by CBT, mindfulness, and EI principles.",
              },
              {
                icon: <Users aria-hidden="true" className="w-10 h-10 text-green-500" />,
                title: "Community",
                desc: "Be part of a network of empathy & care.",
              },
              {
                icon: <Shield aria-hidden="true" className="w-10 h-10 text-blue-500" />,
                title: "Privacy First",
                desc: "Your conversations are always confidential.",
              },
            ].map((f) => (
              <motion.article
                key={f.title}
                whileHover={{ scale: 1.05 }}
                className="shadow-md rounded-2xl p-8 bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.article>
            ))}
          </motion.section>

          {/* Why Chatbot Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="shadow-md rounded-2xl p-10 bg-white hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              💬 Why a Chatbot for Mental Health?
            </h2>
            <ul className="list-disc list-inside text-lg md:text-xl text-gray-700 space-y-3">
              <li>
                <b>Instant Access:</b> No waiting. Just start chatting anytime.
              </li>
              <li>
                <b>Confidential:</b> A judgment-free zone, always private.
              </li>
              <li>
                <b>Evidence-Based:</b> Backed by CBT, mindfulness & EI.
              </li>
              <li>
                <b>Self-Help Tools:</b> Journals, mood tracking, exercises.
              </li>
            </ul>
            <p className="text-lg md:text-xl font-semibold text-gray-800 mt-6">
              Whether you're stressed, anxious, or lonely,{" "}
              <span className="text-blue-600 font-bold">
                MindMitra is here for you 24x7.
              </span>
            </p>
          </motion.section>

          {/* How It Works Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
            aria-label="How MindMitra works"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              🚀 How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Start Chat",
                  desc: "Begin chatting instantly, no signup required.",
                },
                {
                  step: "2",
                  title: "Get Guidance",
                  desc: "Receive personalized responses & resources.",
                },
                {
                  step: "3",
                  title: "Feel Better",
                  desc: "Track mood & follow mindfulness practices.",
                },
              ].map((s) => (
                <motion.article
                  key={s.title}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="text-4xl font-extrabold text-blue-600 mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-600">{s.desc}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-12 shadow-md space-y-8"
            aria-label="Testimonials from MindMitra users"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              💖 What People Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  text: "MindMitra helped me calm down during a panic attack at 2 AM. Grateful it's always there.",
                  user: "Riya, Student",
                },
                {
                  text: "I love the daily mood check-ins. It keeps me accountable and aware of my feelings.",
                  user: "Arjun, Engineer",
                },
                {
                  text: "It feels like talking to a real friend who listens without judgment.",
                  user: "Sneha, Designer",
                },
              ].map((t) => (
                <motion.blockquote
                  key={t.user}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <p className="text-gray-700 italic">“{t.text}”</p>
                  <footer className="mt-4 font-semibold text-blue-600">— {t.user}</footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.section>

          {/* Final CTA */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 text-center shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Ready to begin your journey toward better mental health?
            </h2>
            <Link
              to="/chat"
              aria-label="Start chatting with MindMitra now"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition text-lg"
            >
              Start Chatting Now
            </Link>
          </motion.section>
        </div>
      </div>
    </main>
  );
};
