const jwt = require("jsonwebtoken");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (request, response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.status(401).json({
      success: false,
      message: "Authentication required. Send a Bearer token.",
    });
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return response.status(401).json({
      success: false,
      message: "The user for this token no longer exists.",
    });
  }

  request.user = user;
  next();
});

module.exports = { protect };
