import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import environments from "../configurations/environments";

type UserPayload = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: UserPayload) => {
  const token = jwt.sign(payload, environments.JWT_SECRET as Secret, {
    expiresIn: environments.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
  return token;
};
