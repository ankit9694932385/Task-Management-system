const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString().split("T")[0],
  },
  category: {
    type: String,
    default: "Home",
  },
  description: {
    type: String,
    default: "Not Desription",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
