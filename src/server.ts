import express from "express";
import cors from "cors";
import connectDB from "./configurations/database";
import corsConfig from "./configurations/cors";
import projectRoutes from "./routes/projectRoutes";

connectDB();
const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use("/api/v1/projects", projectRoutes);

export default app;
