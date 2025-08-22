const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const Project = require("../Models/projectModel");

//create project
const createProject = expressAsyncHandler(async (req, res) => {
  try {
    const { title, assignedTo } = req.body;
    const userId = req.user._id;

    const titleExist = await Project.findOne({ title: title });
    if (titleExist) {
      return res.status(401).json({ message: "Title Already Taken" });
    }

    if (assignedTo && assignedTo.length > 0) {
      const users = await User.find({ _id: { $in: assignedTo } });
      if (users.length !== assignedTo.length) {
        return res
          .status(400)
          .json({ message: "One or more assigned users not found." });
      }
    }

    const newProject = new Project({
      title,
      createdBy: userId,
      assignedTo,
    });

    await newProject.save();

    return res.status(201).json({
      message: "Project created.",
      project: newProject,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. from here" });
  }
});

//delete
const deleteProject = expressAsyncHandler(async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ message: "Project deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

//read
const getProjects = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let projects;

    if (userRole === "admin") {
      projects = await Project.find().populate(
        "createdBy assignedTo",
        "fullname email role"
      );
    } else if (userRole === "manager") {
      projects = await Project.find({ createdBy: userId }).populate(
        "assignedTo",
        "fullname email role"
      );
    } else if (userRole === "developer") {
      projects = await Project.find({ assignedTo: userId }).populate(
        "createdBy",
        "fullname email role"
      );
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json({ projects });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error?.message}` });
  }
});

//update Project
const updateProject = expressAsyncHandler(async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, assignedTo } = req.body;


    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    //Only Admin can Update or Manager is not the creator
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Only project is edit by creator or admin." });
    }

    if (title) project.title = title;
    if (assignedTo) project.assignedTo = assignedTo;

    await project.save();
    return res.status(200).json({ message: "Project updated.", project });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

const operationControllers = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};

module.exports = operationControllers;
