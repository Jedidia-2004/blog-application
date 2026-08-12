const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}

const register = asyncHandler(async (request, response) => {
  const { email, username, password } = request.body || {};

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return response.status(400).json({
      success: false,
      message: "Email, username, and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  if (!normalizedEmail || !normalizedUsername || !password) {
    return response.status(400).json({
      success: false,
      message: "Email, username, and password cannot be empty.",
    });
  }

  const user = await User.create({
    email: normalizedEmail,
    username: normalizedUsername,
    password,
  });

  response.status(201).json({
    success: true,
    message: "Registration successful.",
    token: generateToken(user),
    user: publicUser(user),
  });
});

const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return response.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password"
  );
  const passwordMatches = user && (await user.comparePassword(password));

  if (!passwordMatches) {
    return response.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  response.status(200).json({
    success: true,
    message: "Login successful.",
    token: generateToken(user),
    user: publicUser(user),
  });
});

const getCurrentUser = asyncHandler(async (request, response) => {
  response.status(200).json({
    success: true,
    user: publicUser(request.user),
  });
});

module.exports = { register, login, getCurrentUser };
