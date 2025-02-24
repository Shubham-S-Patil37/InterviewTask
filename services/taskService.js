const e = require('express');

(function (taskService) {
  var Q = require('q');
  let { TaskModel } = require("./../schema/taskSchema");
  let { userModel } = require("../schema/userSchema");

  taskService.createNewTask = async (taskDetails) => {
    var deferred = Q.defer();

    try {
      if (!taskDetails.title) {
        return deferred.reject({ "message": "Request missing title", "StatusCode": 400 });
      }
      if (!taskDetails.description) {
        return deferred.reject({ "message": "Request missing description", "StatusCode": 400 });
      }
      if (!taskDetails.assignee) {
        return deferred.reject({ "message": "Request missing assignee", "StatusCode": 400 });
      }
      if (!taskDetails.createdBy) {
        return deferred.reject({ "message": "Request missing createdBy", "StatusCode": 400 });
      }

      let userDetails = await userModel.findOne({ "_id": taskDetails.createdBy });

      if (userDetails.role === "Developer") {
        return deferred.reject({ "message": "Unauthorized to create task", "StatusCode": 401 });
      }

      const newTask = new TaskModel({
        "title": taskDetails.title,
        "description": taskDetails.description,
        "status": "Pending",
        "assignee": taskDetails.assignee,
        "createdBy": taskDetails.createdBy,
        "isActive": true
      });

      await newTask.save();
      deferred.resolve(newTask);

    } catch (error) {
      console.log(`Error in taskService.createNewTask: ${error}`);
      deferred.reject({ "message": `Error in taskService.createNewTask: ${error}`, "StatusCode": 500 });
    }

    return deferred.promise;
  };

  taskService.getAll = async () => {
    var deferred = Q.defer();

    try {
      const result = await TaskModel.find({ isActive: true });
      deferred.resolve(result);
    } catch (error) {
      deferred.reject({ "message": `Error in taskService.getAll: ${error}`, "StatusCode": 500 });
    }

    return deferred.promise;
  };

  taskService.deleteTask = async (taskId, userId) => {
    var deferred = Q.defer();

    try {
      if (!taskId) {
        return deferred.reject({ error: 'taskId is required', "StatusCode": 400 });
      }

      if (!userId) {
        return deferred.reject({ error: 'userId is required', "StatusCode": 400 });
      }

      let userDetails = await userModel.findById(userId);

      if (userDetails.role !== "Admin") {
        return deferred.reject({ "message": "Unauthorized to delete task", "StatusCode": 401 });
      }

      const task = await TaskModel.findById(taskId);
      if (!task) {
        return deferred.reject({ "message": "Task not found", "StatusCode": 404 });
      }

      task.isActive = false;
      await task.save();

      deferred.resolve({ "message": "Task deleted", "StatusCode": 200 });

    } catch (error) {
      deferred.reject({ "message": `Error in taskService.deleteTask: ${error}`, "StatusCode": 500 });
    }

    return deferred.promise;
  };

  taskService.updateTask = async (taskDetails) => {
    var deferred = Q.defer();

    try {
      if (!taskDetails.taskId) {
        return deferred.reject({ error: 'taskId is required', "StatusCode": 400 });
      }
      if (!taskDetails.updatedBy) {
        return deferred.reject({ error: 'updatedBy is required', "StatusCode": 400 });
      }

      let userDetails = await userModel.findById(taskDetails.updatedBy);

      if (userDetails.role === "Developer") {
        return deferred.reject({ "message": "Unauthorized to update task", "StatusCode": 401 });
      }

      if (userDetails._id !== taskDetails.updatedBy && userDetails.role === "Manager") {
        return deferred.reject({ "message": "Unauthorized to update task", "StatusCode": 401 });
      }

      const task = await TaskModel.findById(taskDetails.taskId);
      if (!task) {
        return deferred.reject({ "message": "Task not found", "StatusCode": 404 });
      }

      Object.assign(task, taskDetails);
      await task.save();

      deferred.resolve({ "message": "Task updated", "StatusCode": 200 });

    } catch (error) {
      deferred.reject({ "message": `Error in taskService.updateTask: ${error}`, "StatusCode": 500 });
    }

    return deferred.promise;
  };

})(module.exports);
