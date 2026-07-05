const express = require("express");
const authRouter = require("./modules/auth/auth.routes");
const budgetRouter = require("./modules/budgets/budget.routes");
const transactionRouter = require("./modules/transactions/transaction.routes");
const potRouter = require("./modules/pots/pot.routes");
const billRouter = require("./modules/bills/bill.routes");
const overviewRouter = require("./modules/overview/overview.routes");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/pots", potRouter);
app.use("/api/bills", billRouter);
app.use("/api/overview", overviewRouter);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must not exceed 2 MB" });
  }
  if (err && err.message === "Only JPEG, PNG, and WEBP images are allowed") {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
