const mongoose = require("./db");

// USER
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

// TASK
const taskSchema = new mongoose.Schema({
  title: String,
  description: String, 
  status: {         
    type: String,
    default: "pending"
  },
  userId: String
}, { timestamps: true }); 

const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };