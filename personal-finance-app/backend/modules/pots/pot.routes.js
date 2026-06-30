const express = require("express");
const router = express.Router();
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const validate = require("../middlewares/validate");
const { potDto, moneyDto } = require("./pot.dto");
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
router.post("/", validate(potDto), createPot);
router.put("/:id", validate(potDto), updatePot);
router.delete("/:id", deletePot);
router.post("/:id/add", validate(moneyDto), addMoney);
router.post("/:id/withdraw", validate(moneyDto), withdrawMoney);

module.exports = router;
