require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = 7777;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);