import { User } from "../module/user.entity.ts";
import { createConnection } from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";

export function initTypeORM() {
  return createConnection({
    type: "postgres",
    // host: "user-database.local",
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "users",
    entities: [
      User,
    ],
    synchronize: true,
  });
}