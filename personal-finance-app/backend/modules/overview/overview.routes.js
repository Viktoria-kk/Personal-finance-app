const express = require("express");
const router = express.Router();
const { getOverview } = require("./overview.controller");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");

router.get("/", isAuthMiddleware, getOverview);

module.exports = router;
