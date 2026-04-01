import { useState } from "react";
import "./App.css";

export default function App() {
  const [rawText, setRawText] = useState("");
  const [interested, setInterested] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    organization: "",
    place: "",
    date: "",
  });

  // 🔹 WORKING AUTO-FILL (NO API, NO FETCH)
  const handleAutoFill = () => {
    const text = rawText;

    const name =
      text.match(/my name is\s+([a-zA-Z ]+)/i)?.[1] ||
      text.match(/name[:\-]?\s*([a-zA-Z ]+)/i)?.[1] ||
      "";

    const email =
      text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || "";

    const phone =
      text.match(/(\+91[\s-]?)?\d{10}/)?.[0] || "";

    const event =
      text.match(
        /(freshers|workshop|seminar|conference|meeting|event)/i
      )?.[0] || "";

    const organization =
      text.match(
        /(college|institute|university|office)[a-zA-Z .,&]+/i
      )?.[0] || "";

    const place =
      text.match(
        /(hyderabad|bangalore|chennai|delhi|mumbai|kurnool)/i
      )?.[0] || "";

    const date =
      text.match(
        /\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\b/i
      )?.[0] || "";

    setForm({
      name,
      email,
      phone,
      event,
      organization,
      place,
      date,
    });

    setInterested(false);
  };

  const handleSubmit = () => {
    if (!interested) {
      alert("Please confirm your interest before submitting.");
      return;
    }
    alert("Interest submitted successfully ✅");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>SmartFill AI</h1>
        <p className="subtitle">
          Paste an event, college, or office message.  
          Details will be extracted automatically.
        </p>

        <textarea
  placeholder="Example:
Workshop at XYZ College,
Bangalore on 15 Feb 2026.
Contact: name@email.com | 9876543210"
  value={rawText}
  onChange={(e) => setRawText(e.target.value)}
/>

        <button className="primary" onClick={handleAutoFill}>
          Auto Fill Details
        </button>

        <div className="form">
          <Field icon="👤" value={form.name} placeholder="Name" />
          <Field icon="📧" value={form.email} placeholder="Email" />
          <Field icon="📞" value={form.phone} placeholder="Phone" />
          <Field icon="🎉" value={form.event} placeholder="Event / Function" />
          <Field icon="🏫" value={form.organization} placeholder="Organization" />
          <Field icon="📍" value={form.place} placeholder="Place" />
          <Field icon="📅" value={form.date} placeholder="Date" />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={interested}
            onChange={(e) => setInterested(e.target.checked)}
          />
          I am interested in this event
        </label>

        <button className="submit" onClick={handleSubmit}>
          Submit Interest
        </button>
      </div>
    </div>
  );
}

function Field({ icon, value, placeholder }) {
  return (
    <div className="field">
      <span>{icon}</span>
      <input value={value} placeholder={placeholder} readOnly />
    </div>
  );
}
