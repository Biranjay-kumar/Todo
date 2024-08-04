import express from "express";
import {
  addTask,
  getTasks,
  history,
  removeTask,
  taskCompleted,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();
//routes
/**
 * @swagger
 * /add-task:
 *   post:
 *     summary: Add a new task
 *     description: Adds a new task to the database
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID who is adding the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *               description:
 *                 type: string
 *                 description: The description of the task
 *     responses:
 *       201:
 *         description: Task added successfully
 *       400:
 *         description: Bad request, missing fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to add task
 */
router.post("/add-task", addTask);
/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get all tasks for a user
 *     description: Retrieves all tasks associated with a user
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get tasks for
 *     responses:
 *       200:
 *         description: List of tasks
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to get tasks
 */
router.get("/all", getTasks);
/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get task history for the last 7 days
 *     description: Retrieves tasks created within the last 7 days, grouped by day
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get task history for
 *     responses:
 *       200:
 *         description: Task history by day
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to get task history
 */

router.get("/history", history);
/**
 * @swagger
 * /delete-task/{id}:
 *   delete:
 *     summary: Remove a task
 *     description: Deletes a specific task from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID to be deleted
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID who is removing the task
 *     responses:
 *       200:
 *         description: Task removed successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: Task or user not found
 *       500:
 *         description: Failed to remove task
 */
router.delete("/delete-task/:userId", removeTask);
/**
 * @swagger
 * /complete-task:
 *   put:
 *     summary: Mark a task as completed
 *     description: Updates a task's completion status to true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: The ID of the task to mark as completed
 *     responses:
 *       200:
 *         description: Task marked as completed
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to complete task
 */
router.put("/complete-task", taskCompleted);
/**
 * @swagger
 * /update-task:
 *   put:
 *     summary: Update a task
 *     description: Updates the title, description, and completion status of a task
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the task
 *               description:
 *                 type: string
 *                 description: The new description of the task
 *               isCompleted:
 *                 type: boolean
 *                 description: The updated completion status of the task
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to update task
 */
router.put("/update-task", updateTask);

export default router;
