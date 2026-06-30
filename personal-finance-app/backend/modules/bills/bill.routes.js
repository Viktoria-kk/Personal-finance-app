const express = require("express");
const router = express.Router();
const { getBills, getBillsSummary } = require("./bill.controller");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");

router.use(isAuthMiddleware);
router.get("/summary", getBillsSummary);
router.get("/", getBills);

module.exports = router;
