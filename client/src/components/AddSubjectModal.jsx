import { useState } from "react";
import axios from "axios";

export default function AddSubjectModal({ onClose, onAdded }) {
  const [name, setName] = useState("");
  const [lectureType, setLectureType] = useState("45");

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");

      const totalLectures = Number(lectureType);
      const maxLeaves = totalLectures * 0.2;

      await axios.post(
        "http://localhost:7777/api/subjects",
        {
          name,
          totalLectures,
          maxLeaves,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      onAdded();
    } catch (error) {
      console.error(error);
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
          Add Subject
        </h2>

        {/* Subject Name */}
        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
          Subject Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full p-3 mb-4
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-slate-200
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />

        {/* Lecture Type */}
        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
          Lecture Type
        </label>

        <select
          value={lectureType}
          onChange={(e) => setLectureType(e.target.value)}
          className="
            w-full p-3 mb-6
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-slate-200
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value="45">45 Hours</option>
          <option value="30">30 Hours</option>
          <option value="15">15 Hours</option>
        </select>

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
            onClick={handleAdd}
            className="
              px-4 py-2 rounded-lg
              bg-indigo-600 text-white
              hover:bg-indigo-700
              transition
            "
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}