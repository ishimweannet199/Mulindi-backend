import dotenv from "dotenv"
import User from "./user.controller.js";
import express from "express";
import mongoose from "mongoose";

dotenv.config()

const app = express();
app.use(express.json());
 
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

app.use("/api/users", User)

// Example route
app.get("/", (req, res) => {
  res.send("Hello from MongoDB + Express!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
