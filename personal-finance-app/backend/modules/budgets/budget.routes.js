const express = require("express");
const router = express.Router();
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("./budget.controller");

router.use(isAuthMiddleware);
router.get("/", getBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
