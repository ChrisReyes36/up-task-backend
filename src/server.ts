import express from "express";
import connectDB from "./configurations/database";
import projectRoutes from "./routes/projectRoutes";

connectDB();
const app = express();

app.use(express.json());
app.use("/api/v1/projects", projectRoutes);

export default app;
