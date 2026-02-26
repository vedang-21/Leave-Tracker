export default function JoinClass() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h1 className="text-2xl font-bold text-center mb-6">Join Class</h1>

        <input
          type="text"
          placeholder="Enter Class Code"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
          Join
        </button>
      </div>
    </div>
  );
}