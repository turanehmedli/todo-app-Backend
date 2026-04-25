import { Todo } from "../modules/todo.model.js";

export const getAllTodos = async (req, res) => {
  try {
    let todos = [];

    if (req.user && req.user.role === "admin") {
      todos = await Todo.find().populate(
        "author",
        "role email firstName lastName",
      );
    } else {
      todos = await Todo.find({ author: req.user.id });
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const getTodoId = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, author: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description, author: req.user.id });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findOne({ _id: id, author: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed || todo.completed;

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const {id} = req.params
    if (req.user && req.user.role === "admin") {
      const deleteTodo = await Todo.findByIdAndDelete(id);
      if (!deleteTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json({ message: "Todo deleted successfully" });
    } else {
      const deleteTodo = await Todo.findByIdAndDelete({
        _id: id,
        author: req.user._id,
      });
      if (!deleteTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json({ message: "Todo deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

