📊 Leave Tracker

A full-stack Leave Management and Attendance Tracking System that helps students monitor attendance and manage allowable leaves based on the 80% attendance rule.

Built using React, Node.js, Express, MongoDB, and JWT Authentication.

🚀 Live Demo

Frontend (Vercel)
https://your-vercel-app.vercel.app

Backend API (Render)
https://leave-tracker-z363.onrender.com

🛠 Tech Stack

Frontend

React (Vite)

Tailwind CSS

Axios

dnd-kit (Drag & Drop)

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

✨ Features

• User authentication (Register / Login with JWT)
• Add and manage subjects (15 / 30 / 45 lecture types)
• Automatic 80% attendance rule calculation
• Mark leaves for subjects
• Leave history with search and filters
• Drag and drop subject reordering
• Delete subjects and leave records
• Attendance analytics dashboard
• Fully responsive UI (desktop + mobile)

📂 Project Structure

Leave-Tracker
├── client/ → React frontend
├── server/ → Express backend
└── README.md

⚙️ Running the Project Locally

Clone the repository

git clone https://github.com/yourusername/leave-tracker.git

cd leave-tracker

Backend setup

cd server
npm install

Create .env inside server/

PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key

Start backend

npm start

Frontend setup

cd client
npm install
npm run dev

Frontend runs on: http://localhost:5173

🔑 Environment Variables

Backend (.env)

PORT
MONGO_URI
JWT_SECRET
RESEND_API_KEY

Frontend (.env)

VITE_API_BASE=https://leave-tracker-z363.onrender.com

👨‍💻 Author

Vedang Mane
BTech CSE Student
Full Stack Developer

⭐ Support

If you like this project, consider starring the repository.
