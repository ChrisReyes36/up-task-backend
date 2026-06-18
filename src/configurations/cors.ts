import { CorsOptions } from "cors";
import environments from "./environments";

const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [environments.FRONT_END_URL];

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};

export default corsConfig;
