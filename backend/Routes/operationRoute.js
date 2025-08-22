const express = require("express");
const operationControllers = require("../Controllers/operationControllers");
const authMiddleware = require("../Middlewares/authMiddleware");
const roleCheck = require("../Middlewares/roleCheckMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleCheck("admin", "manager"),
  operationControllers.createOperation
);
router.delete(
  "/delete",
  authMiddleware,
  roleCheck("admin"),
  operationControllers.deleteOperation
);
router.get(
  "/read",
  authMiddleware,
  roleCheck("admin", "manager", "developer"),
  operationControllers.readOperation
);
router.put(
  "/update",
  authMiddleware,
  roleCheck("admin"),
  operationControllers.updateOperation
);

module.exports = router;
