const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { type } = require("os");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/timeManagement");
}

const taskSchema = new mongoose.Schema({
  task: String,
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  category: String,
  description: {
    type: String,
    default: "Not Desription",
  },
});

const Task = mongoose.model("Task", taskSchema);

// Task Route

app.get("/", (req, res) => {
  res.render("task/home.ejs");
});

app.get("/task", async (req, res) => {
  let tasks = await Task.find({});
  res.render("task/alltask.ejs", { tasks });
});

app.get("/task/new", (req, res) => {
  res.render("task/newtask.ejs");
});

app.post("/task", async (req, res) => {
  let tasks = await Task.find({});
  let { task, date, description, category } = req.body;
  let newTask = new Task({ task, date, category, description });
  let newSavedTask = await newTask.save();
  console.log(newSavedTask);
  res.redirect("/task");
});

app.get("/task/:id/edit", async (req, res) => {
  let tasks = await Task.find({});
  let { id } = req.params;
  let data = tasks.find((p) => id === p.id);
  console.log(data);
  res.render("task/edittask.ejs", { data });
});

app.patch("/task/:id", async (req, res) => {
  let tasks = await Task.find({});
  let { id } = req.params;
  let oldData = tasks.find((p) => id === p.id);
  let newData = req.body.newTask;
  console.log(newData);
  for (let key in newData) {
    oldData[key] = newData[key];
  }
  res.redirect("/task");
});

app.delete("/task/:id", async (req, res) => {
  let tasks = await Task.find({});
  let { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.redirect("/task");
});

app.get("/task/:id/detail", async (req, res) => {
  let tasks = await Task.find({});
  let { id } = req.params;
  let data = tasks.find((p) => id === p.id);
  res.render("task/taskdetail.ejs", { data });
});

// Category Route

// home Route

app.get("/task/category", async (req, res) => {
  let tasks = await Task.find({});
  let { category: linkCategory } = req.query;
  try {
    console.log(linkCategory);
  } catch (e) {
    console.log("not found");
  }
  let homeTask = tasks.filter((task) => task.category === `${linkCategory}`);
  console.log(homeTask.description);

  if (homeTask.length > 0) {
    res.render("category/allCategory.ejs", {
      homeTask,
      linkCategory,
    });
  } else {
    res.send("<h1>NO DATA FOUND</h1>");
  }
});

app.listen(3000, () => {
  console.log(`App is Listening on Port 3000`);
});
