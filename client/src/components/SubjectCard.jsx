import { Trash2, GripVertical } from "lucide-react";

export default function SubjectCard({
  subject,
  onDelete,
  dragHandleProps,
}) {
  const {
    name,
    totalLectures,
    leavesTaken = 0,
    maxLeaves,
    status,
    _id,
  } = subject;

  const attendance =
    ((totalLectures - leavesTaken) / totalLectures) * 100;

  const roundedAttendance = Math.round(attendance);
  const leavesRemaining = Math.max(maxLeaves - leavesTaken, 0);
  const statusKey =
    status ||
    (roundedAttendance >= 80
      ? "safe"
      : roundedAttendance >= 70
        ? "risk"
        : "critical");

  const statusLabel = {
    safe: "Safe",
    risk: "Risk",
    critical: "Critical",
  };

  const statusClasses = {
    safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    risk: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[statusKey]}`}
          >
            {statusLabel[statusKey]}
          </span>
        </div>

        {/* Drag ONLY on grip */}
        <div
          {...dragHandleProps}
          className="cursor-grab text-slate-400"
        >
          <GripVertical size={18} />
        </div>
      </div>

      <p className="text-sm text-slate-500">Attendance</p>
      <p className="text-2xl font-bold mb-3">
        {roundedAttendance}%
      </p>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            statusKey === "safe"
              ? "bg-emerald-500"
              : statusKey === "risk"
                ? "bg-amber-500"
                : "bg-red-500"
          }`}
          style={{ width: `${Math.max(0, Math.min(roundedAttendance, 100))}%` }}
        />
      </div>

      <p className="text-sm">
        Leaves Taken: {leavesTaken} / {maxLeaves}
      </p>

      <p className="text-sm">
        Leaves Remaining: {leavesRemaining}
      </p>

      {/* Delete button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            console.log("DELETE CLICKED"); // debug log
            onDelete(_id);
          }}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
