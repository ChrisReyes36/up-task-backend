import mongoose, { Document, Schema, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
}

const TokenSchema = new Schema<IToken>({
  token: { type: String, required: true },
  user: { type: Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, default: Date.now, expires: "10m" },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
