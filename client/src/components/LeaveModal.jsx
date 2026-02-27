import { useState } from "react";
import axios from "axios";

export default function LeaveModal({ subjects, onClose, onSubmit }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:7777/api/leaves",
      {
        subjectName: subjects[selectedIndex].name,
        date,
        reason,
      },
      {
        headers: { Authorization: token },
      }
    );

    onSubmit(selectedIndex);
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Server error");
    }
  }
};
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-200
        p-8 rounded-2xl w-96
        shadow-2xl
        transition-colors duration-300
      ">
        <h2 className="text-2xl font-semibold mb-6">
          Mark Leave
        </h2>

        {/* Subject Select */}
        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
          Select Subject
        </label>

        <select
          className="
            w-full p-3 mb-4
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-slate-200
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {subjects.map((subject, index) => (
            <option key={index} value={index}>
              {subject.name}
            </option>
          ))}
        </select>

        {/* Date */}
        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
          Select Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="
            w-full p-3 mb-4
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-slate-200
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />

        {/* Reason */}
        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
          Reason
        </label>

        <textarea
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="
            w-full p-3 mb-6
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-slate-200
            placeholder-slate-400 dark:placeholder-slate-500
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg
              bg-slate-200 dark:bg-slate-600
              text-slate-800 dark:text-slate-200
              hover:bg-slate-300 dark:hover:bg-slate-500
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-4 py-2 rounded-lg
              bg-indigo-600 text-white
              hover:bg-indigo-700
              transition
            "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}