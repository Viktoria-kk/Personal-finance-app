const express = require("express");
const router = express.Router();
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const validate = require("../middlewares/validate");
const { budgetDto } = require("./budget.dto");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("./budget.controller");

router.use(isAuthMiddleware);
router.get("/", getBudgets);
router.post("/", validate(budgetDto), createBudget);
router.put("/:id", validate(budgetDto), updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
