import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import moment from "moment";

// add a task
const addTask = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.query;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newTask = new Task({
      title,
      description,
      user: id,
    });

    await newTask.save();

    user.tasks.push(newTask._id);
    await user.save();

    // Return success response with new task
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error while adding task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add task",
    });
  }
};

//get all task
const getTasks = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const tasks = await Task.find({ user: id });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get tasks" });
  }
};

//get task history
const history = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const endDate = moment().endOf("day").toDate();
    const startDate = moment().subtract(7, "days").startOf("day").toDate();

    // Fetch tasks within the date range
    const tasks = await Task.find({
      user: id,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Initialize an object to hold tasks grouped by day
    const tasksByDay = {};

    // Loop through tasks and group them by date
    tasks.forEach((task) => {
      const date = moment(task.createdAt).format("YYYY-MM-DD");
      const dayName = moment(task.createdAt).format("dddd"); // Get day name

      if (!tasksByDay[date]) {
        tasksByDay[date] = { dayName, tasks: [] };
      }
      tasksByDay[date].tasks.push(task);
    });

    // Convert object to array and sort by date
    const sortedTasksByDay = Object.entries(tasksByDay)
      .map(([date, { dayName, tasks }]) => ({ date, dayName, tasks }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    res.status(200).json({ success: true, tasksByDay: sortedTasksByDay });
  } catch (error) {
    console.error("Error while getting weekly tasks:", error);
    res.status(500).json({ success: false, message: "Failed to get tasks" });
  }
};

//remove the task
const removeTask = async (req, res) => {
  const { taskId } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    console.log("taskk", task);
    // Delete the task
    
    await Task.findByIdAndDelete(taskId);

    // Update the user to remove the taskId from their tasks array
    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove task",
      error: error.message,
    });
  }
};

//Task completed
const taskCompleted = async (req, res) => {
  const { taskId } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Update the task to mark it as completed
    await Task.findByIdAndUpdate(taskId, { isCompleted: true }, { new: true });

    res
      .status(200)
      .json({ success: true, message: "Task completed successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete task",
      err: error.message,
    });
  }
};

//update task
const updateTask = async (req, res) => {
  const { id: taskId } = req.query;
  const { title, description, isCompleted } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    await Task.findByIdAndUpdate(
      taskId,
      { title, description, isCompleted },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      err: error.message,
    });
  }
};

export { addTask, getTasks, history, removeTask, taskCompleted, updateTask };
