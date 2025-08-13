import { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/contact",
        { subject, message },
        {
          withCredentials: true,
        }
      );
      setStatus({ success: true, message: response.data.message });
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.message || "Error al enviar mensaje" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-b from-[#E0E7DF] to-[#96A999] rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-6 text-[#007BFF]">Contáctanos</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block font-semibold mb-1 text-[#007BFF]">Asunto</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block font-semibold mb-1 text-[#007BFF]">Mensaje</label>
          <textarea
            id="message"
            rows="6"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="w-full border p-3 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
        >
          Enviar Mensaje
        </button>
      </form>

      {status && (
        <p className={`mt-4 font-semibold ${status.success ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
