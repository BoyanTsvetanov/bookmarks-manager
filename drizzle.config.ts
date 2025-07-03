import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL!;
const { host, pathname, username, password } = new URL(DATABASE_URL);

export default defineConfig({
  schema: "./src/infrastructure/db/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host,
    database: pathname.slice(1), // remove leading slash
    user: username,
    password,
    ssl: true,
  },
});
