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
    _id,
  } = subject;

  const attendance =
    ((totalLectures - leavesTaken) / totalLectures) * 100;

  const roundedAttendance = Math.round(attendance);
  const leavesRemaining = Math.max(maxLeaves - leavesTaken, 0);

  let statusColor = "text-green-600";
  let progressColor = "bg-green-500";

  if (leavesRemaining <= 2 && leavesRemaining > 0) {
    statusColor = "text-yellow-500";
    progressColor = "bg-yellow-500";
  }

  if (leavesRemaining <= 0) {
    statusColor = "text-red-500";
    progressColor = "bg-red-500";
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between">

      {/* Header with Drag Handle */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold">{name}</h2>

        <div
          {...dragHandleProps}
          className="cursor-grab text-slate-400"
        >
          <GripVertical size={18} />
        </div>
      </div>

      <p className="text-sm text-slate-500">Attendance</p>
      <p className={`text-2xl font-bold mb-3 ${statusColor}`}>
        {roundedAttendance}%
      </p>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full ${progressColor}`}
          style={{ width: `${roundedAttendance}%` }}
        />
      </div>

      <p className="text-sm">
        Leaves Taken: {leavesTaken} / {maxLeaves}
      </p>

      <p className="text-sm">
        Leaves Remaining: {leavesRemaining}
      </p>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => onDelete(_id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}