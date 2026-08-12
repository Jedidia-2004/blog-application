const cors = require("cors");
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Blog API is healthy.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
