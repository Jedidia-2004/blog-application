require("dotenv").config();

const connectDatabase = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 4000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Add it to server/.env.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required. Add it to server/.env.");
  }

  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Blog API is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start the server:", error.message);
  process.exit(1);
});
