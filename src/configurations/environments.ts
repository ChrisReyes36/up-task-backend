import "dotenv/config";
import { z } from "zod";

const environmentsSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_HOST: z.string().min(1),
  MONGO_PORT: z.coerce.number().int().positive(),
  MONGO_DB: z.string().min(1),
  MONGO_USERNAME: z.string().min(1),
  MONGO_PASSWORD: z.string().min(1),
  FRONT_END_URL: z.string().min(1),
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().positive(),
  MAIL_SECURE: z.string().min(1),
  MAIL_USER: z.string().min(1),
  MAIL_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, "JWT_EXPIRES_IN debe ser algo como 5m, 1h, 7d")
    .default("5m"),
});

const parsedEnvironments = environmentsSchema.safeParse(process.env);

if (!parsedEnvironments.success) {
  console.error("Variables de entorno inválidas");

  const errors = z.treeifyError(parsedEnvironments.error);

  console.dir(errors, {
    depth: null,
    colors: true,
  });

  process.exit(1);
}

const environments = parsedEnvironments.data;

export default environments;
