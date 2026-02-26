import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPanel({ subjects }) {
  if (!subjects.length) return null;

  // ================= DATA PROCESSING =================

  const chartData = subjects.map((subject) => {
    const attendance =
      ((subject.totalLectures - subject.leavesTaken) /
        subject.totalLectures) *
      100;

    return {
      name: subject.name,
      attendance: Math.round(attendance),
    };
  });

  const overallAttendance =
    chartData.reduce((sum, s) => sum + s.attendance, 0) /
    chartData.length;

  const safe = chartData.filter((s) => s.attendance >= 80).length;
  const risky = chartData.filter(
    (s) => s.attendance < 80 && s.attendance >= 70
  ).length;
  const critical = chartData.filter(
    (s) => s.attendance < 70
  ).length;

  const pieData = [
    { name: "Safe", value: safe },
    { name: "Risky", value: risky },
    { name: "Critical", value: critical },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  // ================= UI =================

  return (
    <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">

      <h2 className="text-xl font-semibold mb-6">
        Analytics Overview
      </h2>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Overall Attendance
          </p>
          <p className="text-2xl font-bold">
            {Math.round(overallAttendance)}%
          </p>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Total Subjects
          </p>
          <p className="text-2xl font-bold">
            {subjects.length}
          </p>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            At Risk Subjects
          </p>
          <p className="text-2xl font-bold text-red-500">
            {risky + critical}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-4">
          Attendance by Subject
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Risk Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}