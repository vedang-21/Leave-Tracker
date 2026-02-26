📊 Leave Tracker (Full Stack Project)

📝 Description:
A full-stack Leave Management and Attendance Tracking System built using 
React, Node.js, Express, MongoDB, and JWT authentication.

----------------------------------------------------

🛠 Tech Stack:

💻 Frontend:
- React (Vite)
- Tailwind CSS
- dnd-kit (Drag and Drop)

🧠 Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

----------------------------------------------------

🚀 Main Features:

🔐 1. User Authentication
- Register and Login
- JWT-based authentication
- Multi-user data isolation

📚 2. Subject Management
- Add subjects (15 / 30 / 45 lecture types)
- Automatic 80% attendance logic
- Drag and drop subject reordering
- Delete subjects

📝 3. Leave Management
- Add leave for a subject
- Leave history (dropdown per subject)
- Delete leave records
- Prevent leaves beyond allowed limit

📈 4. Attendance Calculation

Attendance percentage formula:
((Total Lectures - Leaves Taken) / Total Lectures) * 100

Maximum leaves allowed:
20% of total lectures

----------------------------------------------------

📂 Project Structure:

Leave-Tracker/
  ├── client/   → React frontend
  ├── server/   → Express backend
  └── README.md

----------------------------------------------------

⚙ How to Run the Project:

1️⃣ Clone the repository
git clone <your_repo_link>

2️⃣ Backend Setup
cd server
npm install

Create a .env file inside server folder with:

PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend:
npm start

3️⃣ Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173

----------------------------------------------------

🎯 Author:
Vedang Mane

💡 This project demonstrates:
- Full stack development
- Authentication handling
- Business logic enforcement
- Drag and drop UI
- Data isolation per user
- Analytics dashboard

⭐ If you like this project, consider starring the repository!
