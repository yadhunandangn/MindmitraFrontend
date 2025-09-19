// src/components/Chat.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { VscSend } from "react-icons/vsc";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import instance from "../../Api/FastAPI";
import authApi from "../../Api/RestAPI"; // ✅ Spring Boot secured API instance
import { formatAIResponse } from "../../utils/formatResponse";
import { AuthContext } from "../AuthContext";
// NOTE: You previously had BookAppointmentFlow imported; the flow is implemented inline here
// import BookAppointmentFlow from "./BookAppointmentFlow";

export const Chat = () => {
  const { authToken, userId, username } = useContext(AuthContext);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTopicGrid, setShowTopicGrid] = useState(true);
  const [listening, setListening] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Appointment flow state (managed here)
  const [appointmentStep, setAppointmentStep] = useState(null); // null | "doctor" | "date" | "time" | "issue" | "desc"
  const [appointmentDraft, setAppointmentDraft] = useState({
    doctor: null, // full doctor object
    date: "",
    time: "",
    issue: "",
    desc: "",
  });
  const [availableDoctors, setAvailableDoctors] = useState([]); // list of doctor objects for rendering cards

  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null); // ✅ for auto-expanding textarea
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "PATIENT";

  // ✅ Quick Actions (only for Patient)
  const quickActions = [
    {
      emoji: "👀",
      label: "View Appointments",
      desc: "Check your upcoming visits",
      type: "api",
      intent: "retrieve_appointments",
    },
    {
      emoji: "🧑‍⚕️",
      label: "View Doctors",
      desc: "Browse available experts",
      type: "api",
      intent: "view_doctors",
    },
    {
      emoji: "📖",
      label: "View Journal",
      desc: "Read your past entries",
      type: "api",
      intent: "view_journal",
    },

    // redirect actions (Book Appointment will now start in-chat flow)
    {
      emoji: "📅",
      label: "Book Appointment",
      desc: "Schedule a session easily",
      type: "navigate",
      path: "/appointments/book",
    },
    {
      emoji: "📊",
      label: "Track Mood",
      desc: "Log and monitor your mood",
      type: "navigate",
      path: "/mood-tracker",
    },
    {
      emoji: "📝",
      label: "Add Journal",
      desc: "Write your daily reflections",
      type: "navigate",
      path: "/journals",
    },
  ];

  // ✅ Talk About...
  const topics = [
    {
      emoji: "😟",
      label: "Anxiety",
      desc: "Calm racing thoughts and find peace",
    },
    {
      emoji: "😌",
      label: "Stress Relief",
      desc: "Reduce tension & relax your mind",
    },
    {
      emoji: "💤",
      label: "Sleep Issues",
      desc: "Tips for restful, deep sleep",
    },
    {
      emoji: "💪",
      label: "Confidence",
      desc: "Boost your self-esteem & courage",
    },
    {
      emoji: "❤️",
      label: "Relationships",
      desc: "Navigate love & friendships",
    },
    {
      emoji: "🌟",
      label: "Motivation",
      desc: "Get inspired & stay productive",
    },
  ];

  // -------------------------
  // Speech Recognition Setup
  // -------------------------
  useEffect(() => {
    if (!authToken || !userId) setShowLoginModal(true);
    else setShowLoginModal(false);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setPrompt(speechToText);
    };

    recognitionRef.current.onend = () => setListening(false);
  }, [authToken, userId]);

  // -------------------------
  // Toggle Mic
  // -------------------------
  const toggleListening = () => {
    if (showLoginModal) return;
    if (!recognitionRef.current)
      return alert("Voice recognition not supported.");
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // -------------------------
  // Helper formatters (kept as you had them)
  // -------------------------
  const formatAppointments = (appointments) => {
    if (!Array.isArray(appointments) || appointments.length === 0)
      return "No appointments found.";

    const sorted = [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    return sorted
      .map((item, idx) => {
        const statusBadge =
          item.status === "CONFIRMED"
            ? "🟢 Confirmed"
            : item.status === "CANCELLED"
            ? "🔴 Cancelled"
            : `🔖 ${item.status}`;

        return `#${idx + 1}
📅 ${item.date} at ${item.time}
👨‍⚕️ Doctor: ${item.doctorName}
📝 Issue: ${item.issue}
💬 ${item.desc}
${statusBadge}`;
      })
      .join("\n\n");
  };

  const formatDoctors = (doctors) => {
    if (!Array.isArray(doctors) || doctors.length === 0) {
      return "No doctors found.";
    }

    return doctors
      .map(
        (doc, idx) =>
          `#${idx + 1}
🆔 ID: ${doc.id}
👨‍⚕️ Name: ${doc.doctorName}
📌 Specialization: ${doc.specialization}`
      )
      .join("\n\n");
  };

  const formatJournals = (journals) => {
    if (!Array.isArray(journals) || journals.length === 0) {
      return "No journal entries found.";
    }

    return journals
      .map(
        (j, idx) =>
          `#${idx + 1}
🆔 ID: ${j.id}
📝 Entry: ${j.title || "Untitled"}
📖 Notes: ${j.content || "No content"}`
      )
      .join("\n\n");
  };

  // -------------------------
  // Appointment flow helpers
  // -------------------------
  // Add a message to chat (user or ai)
  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Type an AI-style message (uses existing typing effect)
  const typeAIMessage = (text, extra = {}) => {
    // extra can carry attachments like doctors:
    if (!text && !extra.doctors) return;
    // We push message with instant typing effect using same typeAIMessage logic:
    let i = 0;
    const typingMsg = { type: "ai", text: "", ...extra };
    setMessages((prev) => [...prev, typingMsg]);

    const interval = setInterval(() => {
      if (i < (text || "").length) {
        typingMsg.text += (text || "")[i];
        i++;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...typingMsg };
          return updated;
        });
      } else {
        clearInterval(interval);
      }
    }, 5);
  };

  // Start appointment booking flow (called when user clicks Book Appointment)
  const startAppointmentFlow = async () => {
    if (showLoginModal) {
      typeAIMessage("🔒 Please log in to book an appointment.");
      return;
    }

    setShowTopicGrid(false);
    setAppointmentStep("doctor");
    setAppointmentDraft({
      doctor: null,
      date: "",
      time: "",
      issue: "",
      desc: "",
    });
    setAvailableDoctors([]);

    // fetch doctors and show them as cards inside chat
    try {
      const res = await authApi.get("/public/doctors");
      const doctors = Array.isArray(res.data) ? res.data : [];

      setAvailableDoctors(doctors);

      // Push an AI message that includes the doctors list so the UI can render cards
      pushMessage({
        type: "ai",
        text: "👩‍⚕️ Please choose a doctor from the list below:",
        doctors, // custom field — handled in render
      });

      // Also give a short hint
      typeAIMessage(
        "Tap a doctor card to select. After selection, I'll ask for date, time and other details."
      );
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      typeAIMessage("⚠️ Failed to load doctors. Please try again later.");
      setAppointmentStep(null);
    }
  };

  // Called when user clicks a doctor card inside chat
  const handleSelectDoctor = (doc) => {
    // save selected doctor
    setAppointmentDraft((prev) => ({ ...prev, doctor: doc }));
    // indicate selection in chat as a user message
    pushMessage({
      type: "user",
      text: `✅ You selected ${doc.doctorName} (${doc.specialization})`,
    });

    // proceed to next step
    setAppointmentStep("date");
    typeAIMessage("📅 Please enter the appointment date (YYYY-MM-DD):");
  };

  // Validate date (YYYY-MM-DD) and ensure not past date
  const isValidFutureDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const todayStr = new Date().toISOString().split("T")[0];
    return value >= todayStr;
  };

  // Validate time (HH:MM 24h)
  const isValidTime = (value) => {
    if (!/^\d{2}:\d{2}$/.test(value)) return false;
    const [hh, mm] = value.split(":").map(Number);
    if (hh < 0 || hh > 23) return false;
    if (mm < 0 || mm > 59) return false;
    return true;
  };

  // Handles appointment inputs (intercepts typed messages)
  const handleAppointmentInput = async (text) => {
    const trimmed = text.trim();
    if (appointmentStep === "doctor") {
      // If user typed instead of clicking, try to match by ID or name.
      // Accept either doctor.id or doctor.doctorName (case-insensitive)
      const matchById = availableDoctors.find(
        (d) => String(d.id) === trimmed || String(d.id) === trimmed.replace("#", "")
      );
      const matchByName = availableDoctors.find(
        (d) => d.doctorName.toLowerCase() === trimmed.toLowerCase()
      );

      const chosen = matchById || matchByName;
      if (chosen) {
        handleSelectDoctor(chosen);
        return;
      } else {
        typeAIMessage(
          "⚠️ Couldn't match that. Please click a doctor card or type the exact doctor ID or name shown above."
        );
        return;
      }
    }

    if (appointmentStep === "date") {
      if (!isValidFutureDate(trimmed)) {
        typeAIMessage(
          "⚠️ Invalid date. Enter date in YYYY-MM-DD format and ensure it's today or later."
        );
        return;
      }
      setAppointmentDraft((prev) => ({ ...prev, date: trimmed }));
      pushMessage({ type: "user", text: trimmed });
      setAppointmentStep("time");
      typeAIMessage("⏰ Please enter the appointment time (HH:MM, 24-hour):");
      return;
    }

    if (appointmentStep === "time") {
      if (!isValidTime(trimmed)) {
        typeAIMessage("⚠️ Invalid time. Please enter time as HH:MM in 24-hour format.");
        return;
      }
      setAppointmentDraft((prev) => ({ ...prev, time: trimmed }));
      pushMessage({ type: "user", text: trimmed });
      setAppointmentStep("issue");
      typeAIMessage("📝 What is your primary concern? (short title)");
      return;
    }

    if (appointmentStep === "issue") {
      if (!trimmed) {
        typeAIMessage("⚠️ Please enter a short title for your primary concern.");
        return;
      }
      setAppointmentDraft((prev) => ({ ...prev, issue: trimmed }));
      pushMessage({ type: "user", text: trimmed });
      setAppointmentStep("desc");
      typeAIMessage("💬 Please provide a brief description (1-250 chars):");
      return;
    }

    if (appointmentStep === "desc") {
      if (!trimmed) {
        typeAIMessage("⚠️ Please provide a brief description.");
        return;
      }
      // finalize
      const finalDraft = {
        userID: userId,
        docID: appointmentDraft.doctor?.id,
        userName: username,
        issue: appointmentDraft.issue,
        desc: trimmed,
        date: appointmentDraft.date,
        time: appointmentDraft.time,
      };

      // Show user message of the description
      pushMessage({ type: "user", text: trimmed });

      // reset appointment step optimistically
      setAppointmentStep(null);
      setAppointmentDraft({
        doctor: null,
        date: "",
        time: "",
        issue: "",
        desc: "",
      });

      // Send to backend
      try {
        const res = await authApi.post("/auth/book-appointment", finalDraft);
        if (res.status === 200) {
          typeAIMessage("✅ Appointment request sent successfully!");
        } else {
          typeAIMessage("⚠️ Failed to send appointment request. Please try again.");
        }
      } catch (err) {
        console.error("Appointment booking error:", err);
        const message =
          err.response?.data?.message || err.response?.data || "Appointment booking failed.";
        typeAIMessage(`⚠️ ${message}`);
      }
      return;
    }
  };

  // -------------------------
  // Handle Quick Actions (updated)
  // -------------------------
  const handleQuickAction = async (action) => {
    if (showLoginModal) return;

    setShowTopicGrid(false);

    // If Book Appointment: start in-chat flow instead of navigating
    if (action.type === "navigate" && action.path === "/appointments/book") {
      // start booking flow
      await startAppointmentFlow();
      return;
    }

    if (action.type === "navigate") {
      navigate(action.path);
      return;
    }

    if (action.type === "api") {
      let endpoint = "";
      if (action.intent === "retrieve_appointments") {
        endpoint = `/auth/get-appointments/${username}`;
      } else if (action.intent === "view_doctors") {
        endpoint = `/public/doctors`;
      } else if (action.intent === "view_journal") {
        endpoint = `/auth/journals/${username}`;
      }

      try {
        const res = await authApi.get(endpoint);
        const data = res.data;

        let formatted = "";
        if (action.intent === "retrieve_appointments") {
          formatted = formatAppointments(data);
        } else if (action.intent === "view_doctors") {
          formatted = formatDoctors(data);
        } else if (action.intent === "view_journal") {
          formatted = formatJournals(data);
        } else {
          formatted =
            Array.isArray(data) && data.length > 0
              ? JSON.stringify(data, null, 2)
              : "No records found.";
        }

        setMessages((prev) => [...prev, { type: "user", text: action.label }]);
        typeAIMessage(formatted);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "⚠️ Failed to fetch data. Please try again." },
        ]);
      }
    }
  };

  // -------------------------
  // Send message main (keeps FastAPI behavior, but intercepts appointment flow)
  // -------------------------
  const sendMessage = async (text) => {
    if (showLoginModal) return;

    // Intercept if appointment flow is active
    if (appointmentStep) {
      await handleAppointmentInput(text);
      return;
    }

    const userMsg = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await instance.post("/api/chat", {
        username: username,
        role: role,
        message: text,
      });

      const aiText = res.data.reply;
      if (!aiText) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "⚠️ Sorry, something went wrong. No reply received.",
          },
        ]);
        setIsTyping(false);
        return;
      }

      setTimeout(() => {
        setIsTyping(false);
        typeAIMessage(aiText);
      }, 100);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  // -------------------------
  // AI typing effect (keeps original implementation)
  // -------------------------
  const typeAIMessageOriginal = (fullText) => {
    if (!fullText) return;

    let i = 0;
    const typingMsg = { type: "ai", text: "" };
    setMessages((prev) => [...prev, typingMsg]);

    const interval = setInterval(() => {
      if (i < fullText.length) {
        typingMsg.text += fullText[i];
        i++;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...typingMsg };
          return updated;
        });
      } else {
        clearInterval(interval);
      }
    }, 5);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // -------------------------
  // Auto expand textarea
  // -------------------------
  const handleInputChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // -------------------------
  // Handle Enter vs Shift+Enter
  // -------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return; // allow newline
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  // -------------------------
  // Submit form from input
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || showLoginModal) return;
    setShowTopicGrid(false);
    const text = prompt.trim();
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height after send
    }

    await sendMessage(text);
  };

  // -------------------------
  // DoctorCard component (rendered inside chat)
  // -------------------------
  const DoctorCard = ({ doctor, isSelected, onSelect }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(doctor)}
        className={`p-4 border rounded-xl shadow-md cursor-pointer transition w-full sm:w-72
          ${isSelected ? "border-green-600 bg-green-50" : "border-gray-300 hover:shadow-lg"}
        `}
      >
        <h3 className="font-bold text-gray-800">{doctor.doctorName}</h3>
        <p className="text-sm text-gray-600">{doctor.specialization}</p>
        {/* optional extra info */}
        {doctor.clinic && <p className="text-xs text-gray-500 mt-1">{doctor.clinic}</p>}
      </motion.div>
    );
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 h-screen pt-16">
      <div className="w-full py-5 flex items-center justify-center px-4 sm:px-8 md:px-16 h-full">
        <div className="flex flex-1 max-w-6xl rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl overflow-hidden relative h-full">
          {showLoginModal && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
              <p className="text-gray-600 font-medium">🔒 Please log in to chat</p>
            </div>
          )}

          <div className="flex flex-1 h-full overflow-hidden">
            {/* Sidebar after chat starts (only for patients) */}
            {!showTopicGrid && role === "PATIENT" && (
              <div className="hidden md:flex flex-col w-48 border-r border-gray-200 bg-white/60 p-4 space-y-3 h-full">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-2 text-sm rounded-lg bg-indigo-500 text-white shadow hover:shadow-md transition"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Chat area */}
            <div className="flex-1 flex flex-col h-full">
              <div
                ref={chatContainerRef}
                className="flex flex-col space-y-4 overflow-y-auto px-4 py-4 flex-1 scrollbar-thin scrollbar-thumb-gray-400"
              >
                {showTopicGrid && messages.length === 0 ? (
                  <div className="flex flex-col items-center text-center space-y-4 w-full">
                    <h1 className="text-lg sm:text-xl font-light text-gray-700">
                      👋 Hey, welcome back!
                      <br />
                      What’s on your mind today?
                    </h1>

                    {/* Side by Side Sections */}
                    <div className="flex flex-col md:flex-row w-full max-w-6xl mt-6">
                      {/* Quick Action (only for patients) */}
                      {role === "PATIENT" && (
                        <>
                          <div className="flex-1 pr-4">
                            <h2 className="text-md font-semibold text-gray-700 mb-3 text-center">
                              ⚡ Quick Action
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                              {quickActions.map((item, idx) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuickAction(item)}
                                  disabled={showLoginModal}
                                  className={`flex flex-col items-center justify-center rounded-xl p-4 shadow-md transition-all duration-300 text-center h-32 ${
                                    showLoginModal
                                      ? "bg-gray-200 cursor-not-allowed"
                                      : "bg-white hover:bg-indigo-50"
                                  }`}
                                >
                                  <span className="text-2xl">{item.emoji}</span>
                                  <span className="text-sm font-semibold text-gray-800 mt-1">
                                    {item.label}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {item.desc}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Divider Line */}
                          <div className="hidden md:block w-px bg-gray-300"></div>
                        </>
                      )}

                      {/* Talk About... */}
                      <div className="flex-1 pl-4 mt-6 md:mt-0">
                        <h2 className="text-md font-semibold text-gray-700 mb-3 text-center">
                          💬 Talk About...
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                          {topics.map((t, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (!showLoginModal) {
                                  setShowTopicGrid(false);
                                  sendMessage(`Help me with ${t.label.toLowerCase()}.`);
                                }
                              }}
                              disabled={showLoginModal}
                              className={`flex flex-col items-center justify-center rounded-xl p-4 shadow-md transition-all duration-300 text-center h-32 ${
                                showLoginModal ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-indigo-50"
                              }`}
                            >
                              <span className="text-2xl">{t.emoji}</span>
                              <span className="text-sm font-semibold text-gray-800 mt-1">
                                {t.label}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">{t.desc}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed shadow-sm ${
                            msg.type === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl rounded-br-none"
                              : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none"
                          }`}
                        >
                          {/* Render AI text (formatted) or user text */}
                          {msg.type === "ai" ? formatAIResponse(msg.text) : msg.text}

                          {/* If this AI message contains doctors, render them as cards */}
                          {msg.doctors && Array.isArray(msg.doctors) && msg.doctors.length > 0 && (
                            <div className="mt-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {msg.doctors.map((doc) => (
                                  <DoctorCard
                                    key={doc.id}
                                    doctor={doc}
                                    isSelected={appointmentDraft.doctor?.id === doc.id}
                                    onSelect={(d) => {
                                      // choose doctor and proceed to next step
                                      handleSelectDoctor(d);
                                    }}
                                  />
                                ))}
                              </div>

                              {/* small hint for mobile users */}
                              <p className="text-xs text-gray-500 mt-2">
                                Tap a doctor card to select. After selection, you'll be asked for date & time.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm flex items-center space-x-1">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-3 bg-white/70 backdrop-blur-md flex items-center justify-center">
                <form
                  onSubmit={handleSubmit}
                  className={`flex items-end bg-white/90 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-md space-x-2 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] ${
                    showLoginModal ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={showLoginModal}
                    className={`p-2 rounded-full transition ${listening ? "bg-red-100" : "hover:bg-indigo-100"}`}
                  >
                    {listening ? <BsMicMuteFill className="text-lg text-red-500" /> : <BsMicFill className="text-lg text-indigo-600" />}
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={appointmentStep ? "Type your answer for the booking flow..." : "Type a message... "}
                    disabled={showLoginModal}
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none px-1 text-sm resize-none overflow-hidden max-h-32"
                  />

                  <motion.button
                    type="submit"
                    disabled={showLoginModal}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md hover:shadow-lg transition"
                  >
                    <VscSend className="text-lg" />
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="relative bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-2xl border border-gray-200 p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
            >
              <span className="text-white text-2xl">🔒</span>
            </motion.div>

            <h2 className="text-2xl font-extrabold mb-3 text-gray-800 tracking-tight">Login Required</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Please log in to continue using the <span className="font-semibold">Chat</span> feature.
            </p>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Chat;
