import { User } from "../module/user.entity";
import { createConnection } from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";

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