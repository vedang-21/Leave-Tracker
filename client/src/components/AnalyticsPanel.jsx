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

  const safe = subjects.filter((s) => s.status === "safe").length;
  const risky = subjects.filter((s) => s.status === "risk").length;
  const critical = subjects.filter((s) => s.status === "critical").length;

  const pieData = [
    { name: "Safe", value: safe },
    { name: "Risky", value: risky },
    { name: "Critical", value: critical },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  // ================= UI =================

  return (
    <div className="mt-12 grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">
          Attendance by Subject
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">
          Risk Distribution
        </h3>

        <ResponsiveContainer width="100%" height={320}>
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
