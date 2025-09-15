// src/components/BookAppointmentFlow.jsx
import { useState } from "react";
import authApi from "../../Api/RestAPI";

const BookAppointmentFlow = ({ username, onComplete, typeAIMessage }) => {
  const [step, setStep] = useState("doctor");
  const [draft, setDraft] = useState({
    doctorId: "",
    date: "",
    time: "",
    issue: "",
    desc: "",
  });

  // --- Helpers for validation ---
  const isValidDate = (dateStr) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const today = new Date();
    const chosen = new Date(dateStr);
    return chosen >= new Date(today.setHours(0, 0, 0, 0));
  };

  const isValidTime = (timeStr) => /^\d{2}:\d{2}$/.test(timeStr);

  // --- If user clicks a doctor card ---
  const selectDoctor = (doctorId) => {
    setDraft((prev) => ({ ...prev, doctorId }));
    setStep("date");
    typeAIMessage("📅 Please enter the appointment date (YYYY-MM-DD):");
  };

  // --- Handles text input for each step ---
  const handleInput = async (text) => {
    const input = text.trim();

    if (step === "date") {
      if (!isValidDate(input)) {
        typeAIMessage("⚠️ Invalid date. Please use format YYYY-MM-DD (future only):");
        return;
      }
      setDraft((prev) => ({ ...prev, date: input }));
      setStep("time");
      typeAIMessage("⏰ Please enter the appointment time (HH:MM, 24h):");
      return;
    }

    if (step === "time") {
      if (!isValidTime(input)) {
        typeAIMessage("⚠️ Invalid time. Use format HH:MM (24-hour). Example: 14:30");
        return;
      }
      setDraft((prev) => ({ ...prev, time: input }));
      setStep("issue");
      typeAIMessage("📝 What is your primary concern?");
      return;
    }

    if (step === "issue") {
      if (!input) {
        typeAIMessage("⚠️ Primary concern cannot be empty. Please try again:");
        return;
      }
      setDraft((prev) => ({ ...prev, issue: input }));
      setStep("desc");
      typeAIMessage("💬 Please provide a brief description:");
      return;
    }

    if (step === "desc") {
      if (!input) {
        typeAIMessage("⚠️ Description cannot be empty. Please try again:");
        return;
      }

      const finalDraft = { ...draft, desc: input, username };

      // --- Final API call ---
      try {
        const res = await authApi.post("/auth/book-appointment", finalDraft);
        if (res.status === 200) {
          typeAIMessage("✅ Appointment request sent successfully!");
        } else {
          typeAIMessage("⚠️ Failed to send appointment request. Please try later.");
        }
      } catch (err) {
        console.error("Booking error:", err);
        typeAIMessage("⚠️ Network/server error while booking appointment.");
      }

      setStep(null); // end flow
      onComplete();
    }
  };

  return { handleInput, selectDoctor, step };
};

export default BookAppointmentFlow;
