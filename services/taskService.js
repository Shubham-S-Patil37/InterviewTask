const express = require('express');
const { TaskModel } = require("./../schema/taskSchema");
const { userModel } = require("../schema/userSchema");

(function (taskService) {

  taskService.createNewTask = async (taskDetails) => {
    try {
      const { title, description, assignee, createdBy } = taskDetails;

      if (!title || !description || !assignee || !createdBy) {
        throw { message: "Request missing required fields", StatusCode: 400 };
      }

      const userDetails = await userModel.findOne({ "_id": createdBy });

      if (userDetails.role === "Developer") {
        throw { message: "Unauthorized to create task", StatusCode: 401 };
      }

      const newTask = new TaskModel({ title, description, status: "Pending", assignee, createdBy, isActive: true });

      await newTask.save();
      return newTask;

    } catch (error) {
      console.log(`Error in taskService.createNewTask: ${error}`);
      throw { message: `Error in taskService.createNewTask: ${error.message || error}`, StatusCode: error.StatusCode ? error.StatusCode : 500 };
    }
  };

  taskService.getAll = async () => {
    try {
      const result = await TaskModel.find({ isActive: true });
      return result;
    } catch (error) {
      throw { message: `Error in taskService.getAll: ${error.message || error}`, StatusCode: error.StatusCode ? error.StatusCode : 500 };
    }
  };

  taskService.deleteTask = async (taskId, userId) => {
    try {
      if (!taskId || !userId) {
        throw { error: 'taskId and userId are required', StatusCode: 400 };
      }

      const userDetails = await userModel.findById(userId);

      if (userDetails.role !== "Admin") {
        throw { message: "Unauthorized to delete task", StatusCode: 401 };
      }

      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw { message: "Task not found", StatusCode: 404 };
      }

      task.isActive = false;
      await task.save();

      return { message: "Task deleted", StatusCode: 200 };

    } catch (error) {
      throw { message: `Error in taskService.deleteTask: ${error.message || error}`, StatusCode: error.StatusCode ? error.StatusCode : 500 };
    }
  };

  taskService.updateTask = async (taskDetails) => {
    try {
      const { taskId, updatedBy } = taskDetails;

      if (!taskId || !updatedBy) {
        throw { error: 'taskId and updatedBy are required', StatusCode: 400 };
      }

      const userDetails = await userModel.findById(updatedBy);

      if (userDetails.role === "Developer" || (userDetails.role === "Manager" && userDetails._id !== updatedBy)) {
        throw { message: "Unauthorized to update task", StatusCode: 401 };
      }

      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw { message: "Task not found", StatusCode: 404 };
      }

      Object.assign(task, taskDetails);
      await task.save();

      return { message: "Task updated", StatusCode: 200 };

    } catch (error) {
      throw { message: `Error in taskService.updateTask: ${error.message || error}`, StatusCode: error.StatusCode ? error.StatusCode : 500 };
    }
  };

})(module.exports);
