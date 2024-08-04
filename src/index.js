import express from "express";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/dbConnection.js";
import userRoute from "../src/routes/userRoute.js";
import taskRoute from "../src/routes/taskRoute.js";
import { swaggerUi, swaggerSpec } from "./swagger.js"; // Separate Swagger setup

const app = express();
const PORT = process.env.PORT || 7000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling for wrong API endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDb();
});
