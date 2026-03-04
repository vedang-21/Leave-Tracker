import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import SubjectCard from "../components/SubjectCard";
import LeaveModal from "../components/LeaveModal";
import AddSubjectModal from "../components/AddSubjectModal";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { Sun, Moon, Plus } from "lucide-react";

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

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://leave-tracker-z363.onrender.com";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [subjects, setSubjects] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [leaveSearch, setLeaveSearch] = useState("");
  const [leaveSort, setLeaveSort] = useState("newest");

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

  useEffect(() => {
    if (!token) window.location.href = "/";
  }, [token]);

  const fetchSubjects = useCallback(async () => {
    const res = await axios.get(`${API_BASE}/api/subjects`, {
      headers: { Authorization: token },
    });
    setSubjects(res.data);
  }, [token]);

  const fetchLeaves = useCallback(async () => {
    const res = await axios.get(`${API_BASE}/api/leaves`, {
      headers: { Authorization: token },
    });
    setLeaves(res.data);
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects();
      fetchLeaves();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchSubjects, fetchLeaves]);

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Delete this subject and all its leaves?")) return;

    await axios.delete(`${API_BASE}/api/subjects/${id}`, {
      headers: { Authorization: token },
    });

    fetchSubjects();
    fetchLeaves();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = subjects.findIndex((s) => s._id === active.id);
    const newIndex = subjects.findIndex((s) => s._id === over.id);

    const newSubjects = arrayMove(subjects, oldIndex, newIndex);
    setSubjects(newSubjects);

    await axios.put(
      `${API_BASE}/api/subjects/reorder`,
      { orderedIds: newSubjects.map((s) => s._id) },
      { headers: { Authorization: token } }
    );
  };

  const subjectsWithLeaves = useMemo(
    () =>
      subjects.map((subject) => {
        const leavesTaken = leaves.filter(
          (leave) => leave.subjectName === subject.name
        ).length;
        const attendance =
          ((subject.totalLectures - leavesTaken) / subject.totalLectures) * 100;
        const leavesRemaining = Math.max(subject.maxLeaves - leavesTaken, 0);

        let status = "safe";
        if (leavesRemaining <= 0 || attendance <= 80) status = "critical";
        else if (leavesRemaining <= 2 || attendance < 85) status = "risk";

        return {
          ...subject,
          leavesTaken,
          attendance: Math.round(attendance),
          status,
          leavesRemaining,
        };
      }),
    [subjects, leaves]
  );

  const filteredSubjects = useMemo(() => {
    if (activeFilter === "all") return subjectsWithLeaves;
    return subjectsWithLeaves.filter((subject) => subject.status === activeFilter);
  }, [subjectsWithLeaves, activeFilter]);

  const filterCounts = useMemo(
    () => ({
      all: subjectsWithLeaves.length,
      safe: subjectsWithLeaves.filter((s) => s.status === "safe").length,
      risk: subjectsWithLeaves.filter((s) => s.status === "risk").length,
      critical: subjectsWithLeaves.filter((s) => s.status === "critical").length,
    }),
    [subjectsWithLeaves]
  );

  const kpis = useMemo(() => {
    if (!subjectsWithLeaves.length) {
      return {
        overallAttendance: 0,
        atRiskSubjects: 0,
        totalLeavesUsed: 0,
        totalLeavesLeft: 0,
      };
    }

    return {
      overallAttendance: Math.round(
        subjectsWithLeaves.reduce((sum, s) => sum + s.attendance, 0) /
          subjectsWithLeaves.length
      ),
      atRiskSubjects: subjectsWithLeaves.filter((s) => s.status !== "safe").length,
      totalLeavesUsed: subjectsWithLeaves.reduce((sum, s) => sum + s.leavesTaken, 0),
      totalLeavesLeft: subjectsWithLeaves.reduce((sum, s) => sum + s.leavesRemaining, 0),
    };
  }, [subjectsWithLeaves]);

  const historyRows = useMemo(() => {
    const normalizedQuery = leaveSearch.trim().toLowerCase();

    const filtered = leaves.filter((leave) => {
      const subjectMatches =
        !selectedSubject || leave.subjectName === selectedSubject;
      const queryMatches =
        !normalizedQuery ||
        leave.reason.toLowerCase().includes(normalizedQuery) ||
        leave.subjectName.toLowerCase().includes(normalizedQuery);

      return subjectMatches && queryMatches;
    });

    return filtered.sort((a, b) => {
      if (leaveSort === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [leaves, selectedSubject, leaveSearch, leaveSort]);

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "safe", label: "Safe" },
    { id: "risk", label: "At Risk" },
    { id: "critical", label: "Critical" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 md:px-6 py-8 md:py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">
            Welcome {localStorage.getItem("name")}
          </h1>

          <div className="grid grid-cols-2 md:flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center gap-2"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden md:inline">Theme</span>
            </button>

            <button
              onClick={() => setIsSubjectOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Add Subject
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
            >
              Add Leave
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          <KpiCard title="Overall Attendance" value={`${kpis.overallAttendance}%`} />
          <KpiCard title="At-Risk Subjects" value={kpis.atRiskSubjects} tone="danger" />
          <KpiCard title="Leaves Used" value={kpis.totalLeavesUsed} />
          <KpiCard title="Leaves Left" value={kpis.totalLeavesLeft} tone="success" />
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === tab.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tab.label} ({filterCounts[tab.id]})
            </button>
          ))}
        </div>

        {subjectsWithLeaves.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-xl font-semibold mb-2">No subjects yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-5">
              Add your first subject to start tracking attendance and leave usage.
            </p>
            <button
              onClick={() => setIsSubjectOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg"
            >
              Add Subject
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredSubjects.map((s) => s._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
                {filteredSubjects.map((subject) => (
                  <SortableItem key={subject._id} id={subject._id}>
                    {(dragProps) => (
                      <SubjectCard
                        subject={subject}
                        onDelete={handleDeleteSubject}
                        dragHandleProps={dragProps}
                      />
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <AnalyticsPanel subjects={subjectsWithLeaves} />

        <div className="mt-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-5">Leave History</h2>

          <div className="grid md:grid-cols-3 gap-3 mb-5">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search reason or subject..."
              value={leaveSearch}
              onChange={(e) => setLeaveSearch(e.target.value)}
              className="w-full p-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            />

            <select
              value={leaveSort}
              onChange={(e) => setLeaveSort(e.target.value)}
              className="w-full p-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {historyRows.length === 0 ? (
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-5 text-sm text-slate-500 dark:text-slate-400">
              No leave records for current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Subject</th>
                    <th className="py-3 pr-4 font-medium">Reason</th>
                    <th className="py-3 pr-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-slate-200 dark:border-slate-700 last:border-none"
                    >
                      <td className="py-3 pr-4">
                        {new Date(leave.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">{leave.subjectName}</td>
                      <td className="py-3 pr-4">{leave.reason}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={async () => {
                            await axios.delete(`${API_BASE}/api/leaves/${leave._id}`, {
                              headers: { Authorization: token },
                            });
                            fetchLeaves();
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xl text-white flex items-center gap-2 px-4 h-14 md:hidden z-50"
      >
        <Plus size={20} />
        Leave
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

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

function KpiCard({ title, value, tone = "default" }) {
  const toneClass = {
    default: "text-slate-900 dark:text-slate-100",
    success: "text-emerald-600 dark:text-emerald-400",
    danger: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${toneClass[tone]}`}>{value}</p>
    </div>
  );
}
