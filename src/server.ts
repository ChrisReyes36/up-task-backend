import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configurations/database";
import corsConfig from "./configurations/cors";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";

connectDB();
const app = express();

app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

export default app;
