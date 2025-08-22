const express = require("express");
const operationControllers = require("../Controllers/projectControllers");
const authMiddleware = require("../Middlewares/authMiddleware");
const roleCheck = require("../Middlewares/roleCheckMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleCheck("admin", "manager"),
  operationControllers.createProject
);
router.delete(
  "/delete/:id",
  authMiddleware,
  roleCheck("admin"),
  operationControllers.deleteProject
);
router.get(
  "/read",
  authMiddleware,
  roleCheck("admin", "manager", "developer"),
  operationControllers.getProjects
);

router.put(
  "/update/:id",
  authMiddleware,
  roleCheck("admin","manager"),
  operationControllers.updateProject
);

module.exports = router;
