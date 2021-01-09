import { User } from "../module/hotels.entity.ts";
import { createConnection } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";

export function initTypeORM() {
  return createConnection({
    type: "postgres",
    host: Deno.env.get('POSTGRES_HOST') || 'localhost',
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "lts",
    entities: [
      User,
    ],
    synchronize: true,
  });
}