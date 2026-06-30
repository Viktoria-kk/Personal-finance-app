const express = require("express");
const router = express.Router();
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const {
  getPots,
  createPot,
  updatePot,
  deletePot,
  addMoney,
  withdrawMoney,
} = require("./pot.controller");

router.use(isAuthMiddleware);
router.get("/", getPots);
router.post("/", createPot);
router.put("/:id", updatePot);
router.delete("/:id", deletePot);
router.post("/:id/add", addMoney);
router.post("/:id/withdraw", withdrawMoney);

module.exports = router;
