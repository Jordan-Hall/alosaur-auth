import { LibertyJWTSchema } from "../mods.ts";
import { DAYS_30 } from "./environmental.ts";

export const JWTSchema = new LibertyJWTSchema("HS512", "secret_key", DAYS_30);