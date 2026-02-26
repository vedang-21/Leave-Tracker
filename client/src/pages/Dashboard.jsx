import { useState, useEffect } from "react";
import axios from "axios";
import SubjectCard from "../components/SubjectCard";
import LeaveModal from "../components/LeaveModal";
import AddSubjectModal from "../components/AddSubjectModal";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { Sun, Moon } from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/";

  const [subjects, setSubjects] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showMoreSubjects, setShowMoreSubjects] = useState(false);

  // ================= THEME =================
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const sensors = useSensors(useSensor(PointerSensor));

  // ================= FETCH =================
  const fetchSubjects = async () => {
    const res = await axios.get(
      "http://localhost:7777/api/subjects",
      { headers: { Authorization: token } }
    );
    setSubjects(res.data);
  };

  const fetchLeaves = async () => {
    const res = await axios.get(
      "http://localhost:7777/api/leaves",
      { headers: { Authorization: token } }
    );
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchSubjects();
    fetchLeaves();
  }, []);

  // ================= DELETE SUBJECT =================
  const handleDeleteSubject = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this subject and all its leaves?"
    );
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:7777/api/subjects/${id}`,
      { headers: { Authorization: token } }
    );

    fetchSubjects();
    fetchLeaves();
  };

  // ================= DRAG =================
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = subjects.findIndex((s) => s._id === active.id);
    const newIndex = subjects.findIndex((s) => s._id === over.id);

    const newSubjects = arrayMove(subjects, oldIndex, newIndex);
    setSubjects(newSubjects);

    await axios.put(
      "http://localhost:7777/api/subjects/reorder",
      { orderedIds: newSubjects.map((s) => s._id) },
      { headers: { Authorization: token } }
    );
  };

  // ================= CALCULATIONS =================
  const calculateLeavesTaken = (subjectName) =>
    leaves.filter((l) => l.subjectName === subjectName).length;

  const subjectsWithLeaves = subjects.map((subject) => ({
    ...subject,
    leavesTaken: calculateLeavesTaken(subject.name),
  }));

  const getLeavesBySubject = (subjectName) =>
    leaves.filter((l) => l.subjectName === subjectName);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-10 transition-colors duration-300">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome {localStorage.getItem("name")}
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsSubjectOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Add Subject
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SUBJECTS */}
      <div className="max-w-7xl mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={subjects.map((s) => s._id)}
            strategy={rectSortingStrategy}
          >
            {/* FIRST 3 */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {subjectsWithLeaves.slice(0, 3).map((subject) => (
                <SortableItem key={subject._id} id={subject._id}>
                  <SubjectCard
                    subject={subject}
                    onDelete={handleDeleteSubject}
                  />
                </SortableItem>
              ))}
            </div>

            {/* MORE SUBJECTS */}
            {subjectsWithLeaves.length > 3 && (
              <div className="mt-8">
                <button
                  onClick={() =>
                    setShowMoreSubjects(!showMoreSubjects)
                  }
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  {showMoreSubjects
                    ? "Hide Extra Subjects"
                    : "See More Subjects"}
                </button>

                {showMoreSubjects && (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    {subjectsWithLeaves.slice(3).map((subject) => (
                      <SortableItem
                        key={subject._id}
                        id={subject._id}
                      >
                        <SubjectCard
                          subject={subject}
                          onDelete={handleDeleteSubject}
                        />
                      </SortableItem>
                    ))}
                  </div>
                )}
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* ANALYTICS */}
      <div className="max-w-7xl mx-auto mt-16">
        <AnalyticsPanel subjects={subjectsWithLeaves} />
      </div>

      {/* LEAVE HISTORY */}
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-2xl font-semibold mb-6">
          Leave History
        </h2>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full md:w-80 p-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>

        {selectedSubject && (
          <div className="mt-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            {getLeavesBySubject(selectedSubject).length === 0 ? (
              <p>No leaves taken.</p>
            ) : (
              getLeavesBySubject(selectedSubject).map((leave) => (
                <div
                  key={leave._id}
                  className="flex justify-between items-center py-3 border-b dark:border-slate-700 last:border-none"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(leave.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {leave.reason}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:7777/api/leaves/${leave._id}`,
                        { headers: { Authorization: token } }
                      );
                      fetchLeaves();
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* FLOATING ADD LEAVE BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 w-16 h-16 rounded-full text-3xl shadow-xl text-white flex items-center justify-center transition-transform hover:scale-110 z-50"
      >
        +
      </button>

      {isOpen && (
        <LeaveModal
          subjects={subjects}
          onClose={() => setIsOpen(false)}
          onSubmit={() => {
            fetchLeaves();
            setIsOpen(false);
          }}
        />
      )}

      {isSubjectOpen && (
        <AddSubjectModal
          onClose={() => setIsSubjectOpen(false)}
          onAdded={() => {
            fetchSubjects();
            setIsSubjectOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ================= SORTABLE ITEM =================
function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}