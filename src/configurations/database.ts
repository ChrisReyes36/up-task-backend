import { exit } from "node:process";
import mongoose from "mongoose";
import colors from "colors";
import environments from "./environments";

const connectDB = async () => {
  try {
    const { MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USERNAME, MONGO_PASSWORD } =
      environments;
    const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
    const {
      connection: { host, port },
    } = await mongoose.connect(url);
    console.log(colors.magenta.bold(`MongoDB conectado en ${host}:${port}`));
  } catch (error) {
    console.log(colors.red.bold("Error al conectar a MongoDB"));
    exit(1);
  }
};

export default connectDB;
