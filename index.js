const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

let port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`App is Listening on Port ${port}`);
});

let tasks = [
  {
    id: uuidv4(),
    userId: "user1",
    task: "Complete backend API",
    description: "Implement RESTful endpoints for user and task management",
    startDate: "2025-01-29",
    endDate: "2025-01-25",
    status: "In Progress",
    category: "Office",
  },
  {
    id: uuidv4(),
    userId: "user2",
    task: "Design UI",
    description: "Create a responsive UI using AngularJS",
    startDate: "2025-01-25",
    endDate: "2025-01-28",
    status: "Pending",
    category: "Office",
  },
  {
    id: uuidv4(),
    userId: "user3",
    task: "Test application",
    description: "Perform end-to-end testing for the application",
    startDate: "2025-01-25",
    endDate: "2025-01-30",
    status: "Pending",
    category: "Office",
  },
  {
    id: uuidv4(),
    userId: "user4",
    task: "Going to market",
    description: "Resolve bugs identified in testing",
    startDate: "2025-01-25",
    endDate: "2025-01-31",
    status: "Pending",
    category: "Personal",
  },
];

app.get("/", (req, res) => {
  res.render("task/home.ejs");
});

app.get("/task", (req, res) => {
  res.render("task/alltask.ejs", { tasks });
});

app.get("/task/new", (req, res) => {
  res.render("task/newtask.ejs", { tasks });
});

app.post("/task", (req, res) => {
  let { task, endDate, startDate, description, category } = req.body;
  let id = uuidv4();
  tasks.push({ task, description, startDate, endDate, id, category });
  res.redirect("/task");
});

app.get("/task/:id/edit", (req, res) => {
  let { id } = req.params;
  let data = tasks.find((p) => id === p.id);
  console.log(data);
  res.render("task/edittask.ejs", { data });
});

app.patch("/task/:id", (req, res) => {
  let { id } = req.params;
  let oldData = tasks.find((p) => id === p.id);
  let newData = req.body.newTask;
  console.log(newData);
  for (let key in newData) {
    oldData[key] = newData[key];
  }
  res.redirect("/task");
});

app.delete("/task/:id", (req, res) => {
  let { id } = req.params;
  tasks = tasks.filter((p) => id !== p.id);
  res.redirect("/task");
});

app.get("/task/:id/detail", (req, res) => {
  let { id } = req.params;
  let data = tasks.find((p) => id === p.id);
  console.log(data);
  res.render("task/taskdetail.ejs", { data });
});
