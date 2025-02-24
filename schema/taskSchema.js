const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    required: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: true,
  }
});

const TaskModel = new mongoose.model("Task", TaskSchema)
module.exports = { TaskModel }