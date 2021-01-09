import { FileEntity } from "../module/file.entity.ts";
import { createConnection } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";

export function initTypeORM() {
  const envPort = Deno.env.get('POSTGRES_PORT');
  const port = envPort ? parseInt(envPort) : 25060;
  return createConnection({
    type: "postgres",
    host: Deno.env.get('POSTGRES_HOST') || 'localhost',
    port,
    username: Deno.env.get('POSTGRES_USER') || "postgres",
    password: Deno.env.get('POSTGRES_PASSWORD') || "postgres",
    database: Deno.env.get('POSTGRES_DB') || "lts",
    ssl: true,
    entities: [
      FileEntity,
    ],
    synchronize: true,
  });
}