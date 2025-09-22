const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let logs = []; // for now we store in memory

// Route: save a log
app.post("/log", (req, res) => {
  logs.push(req.body);
  console.log("Log received:", req.body);
  res.json({ message: "Log saved" });
});

// Route: get all logs
app.get("/logs", (req, res) => {
  res.json(logs);
});

// Start server
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
