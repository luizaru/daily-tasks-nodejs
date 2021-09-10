const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");


// List all tasks
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name) {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const todos = await Todo.find(searchOptions);
    let locals = {
      todos,
      searchOptions: req.query
    };
    res.render("todos/index", locals);
  } catch {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  let locals = {
    todo: new Todo()
  };
  res.render("todos/new", locals);
});

router.post("/", async (req, res) => {
  const todo = new Todo({
    name: req.body.name
  });

  try {
    const newTodo = await todo.save();
    res.redirect(`todos/${newTodo.id}`);
  } catch {
    let locals = {
      todo: todo,
      errorMessage: "Error Creating New Task"
    };
    res.render("todos/new", locals);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    let locals = {
      todo,
    };
    res.render("todos/show", locals);
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.render("todos/edit", { todo: todo });
  } catch {
    res.redirect("/todos");
  }
});

router.put("/:id", async (req, res) => {
  let todo;
  try {
    todo = await Todo.findById(req.params.id);
    todo.name = req.body.name;
    await todo.save();
    res.redirect(`/todos/${todo.id}`);
  } catch {
    if (todo == null) {
      res.redirect("/");
    } else {
      let locals = {
        todo: todo,
        errorMessage: "Error Updating Task"
      };
      res.render("todos/edit", locals);
    }
  }
});

router.delete("/:id", async (req, res) => {
  let todo;
  try {
    todo = await Todo.findById(req.params.id);
    await todo.remove();
    res.redirect(`/todos`);
  } catch {
    if (todo == null) {
      res.redirect('/');
    } else {
      res.redirect(`/todos/${todo.id}`);
    }
  }
});
module.exports = router;


