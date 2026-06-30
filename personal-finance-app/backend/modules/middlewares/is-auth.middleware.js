const jwt = require("jsonwebtoken");
const User = require("../auth/auth.model");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 'Bearer asdasdasdasdhjasdasdasd'
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({ message: "permission denied" });
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "permission denied" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("+tokenVersion");
    if (!user || (user.tokenVersion || 0) !== payload.tokenVersion) {
      return res.status(401).json({ message: "permission denied" });
    }
    req["userId"] = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "permission denied" });
  }
};
