const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();

const { User, Task } = require("./models");
const { auth, adminOnly } = require("./middleware");

const app = express();

app.use(express.json());
app.use(cors());

// ================= AUTH =================

// REGISTER
app.post("/api/v1/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      "secret123"
    );

    res.send({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// LOGIN
app.post("/api/v1/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      "secret123"
    );

    res.send({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false });
  }
});

// ================= TASK CRUD =================

// CREATE
app.post("/api/v1/tasks", auth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      userId: req.user.id
    });

    res.send({ success: true, data: task });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false });
  }
});

// READ
app.get("/api/v1/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.send({ success: true, data: tasks });
  } catch (err) {
    res.status(500).send({ success: false });
  }
});

// UPDATE
app.put("/api/v1/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      },
      { new: true }
    );

    res.send({ success: true, data: task });
  } catch (err) {
    res.status(500).send({ success: false });
  }
});

// DELETE
app.delete("/api/v1/tasks/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).send({ success: false });
  }
});

// ADMIN
app.get("/api/v1/admin", auth, adminOnly, (req, res) => {
  res.send({ success: true, message: "Welcome Admin" });
});

app.listen(5000, () => console.log("Server running on 5000"));