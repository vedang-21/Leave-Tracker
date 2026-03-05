📊 Leave Tracker

A Full Stack Leave Management & Attendance Tracking System that helps students track attendance and manage allowable leaves based on the 80% attendance rule used in many universities.

The application allows users to add subjects, mark leaves, track attendance automatically, and view analytics about their attendance status.

Built using React, Node.js, Express, MongoDB, and JWT Authentication.

🚀 Live Demo

Frontend (Vercel)
https://your-vercel-app.vercel.app

Backend API (Render)
https://leave-tracker-z363.onrender.com

🏗 Deployment Architecture

User → Vercel (React Frontend) → Render (Node.js Backend) → MongoDB Atlas

The frontend communicates with the backend through REST APIs, and all user data is securely stored in MongoDB.

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

dnd-kit (Drag & Drop)

Lucide Icons

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Resend Email API

✨ Features
🔐 User Authentication

User Registration and Login

JWT-based authentication

Secure password hashing

Forgot password via email reset link

Multi-user data isolation

📚 Subject Management

Users can manage subjects and track attendance.

Features include:

Add subjects with predefined lecture types (15 / 30 / 45 lectures)

Automatic 80% attendance rule

Drag and drop subject reordering

Delete subjects

Responsive subject dashboard

📝 Leave Management

Track leave records for each subject.

Features include:

Add leave for a subject

Leave history tracking

Filter by subject

Search by reason

Sort leaves by newest or oldest

Delete leave records

Prevent leaves beyond allowed limit

📈 Attendance Calculation

Attendance percentage is calculated automatically using:

Attendance % = ((Total Lectures − Leaves Taken) / Total Lectures) × 100

Maximum allowed leaves:

Max Leaves = 20% of Total Lectures

📊 Analytics Dashboard

The dashboard provides insights such as:

Overall attendance percentage

Subjects at risk

Total leaves used

Remaining allowable leaves

📱 Responsive Design

The application is fully responsive and optimized for:

Desktop

Tablets

Mobile devices

Includes:

Floating mobile action button

Responsive card grid

Touch-friendly drag interactions

📂 Project Structure

Leave-Tracker
│
├── client/ → React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
│
├── server/ → Express Backend
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── index.js
│
└── README.md
⚙️ Running the Project Locally
1. Clone the Repository

git clone https://github.com/yourusername/leave-tracker.git

cd leave-tracker

Backend Setup

Navigate to server:

cd server

Install dependencies:

npm install

Create a .env file inside the server folder with:

PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key

Start the backend:

npm start

Backend runs on:
http://localhost:7777

Frontend Setup

Navigate to client:

cd client

Install dependencies:

npm install

Run frontend:

npm run dev

Frontend runs on:
http://localhost:5173

🔑 Environment Variables
Backend (.env)

PORT
MONGO_URI
JWT_SECRET
RESEND_API_KEY

Frontend (.env)

Create .env inside the client folder:

VITE_API_BASE=https://leave-tracker-z363.onrender.com

📌 Future Improvements

Possible enhancements:

Graph-based analytics dashboard

Progressive Web App (PWA)

Timetable integration

Smart bunk prediction

Attendance alerts

Email reminders

👨‍💻 Author

Vedang Mane
First Year BTech CSE Cybersecurity Student
Full Stack Developer

⭐ Support

If you like this project, consider starring the repository.
It helps a lot!