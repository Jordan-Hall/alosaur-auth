import { LibertyJWTSchema } from "../../mods.ts";
import { DAYS_30 } from "./environmental.ts";
import { dirname, fromFileUrl } from "https://deno.land/x/djwt@v2.0/examples/example_deps.ts";


const moduleDir = dirname(fromFileUrl(import.meta.url));
const publicKey = await Deno.readTextFile(moduleDir + "/certs/public.pem");
const privateKey = await Deno.readTextFile(moduleDir + "/certs/private.pem");

export const JWTSchema = new LibertyJWTSchema("RS256", DAYS_30, {
	type: "JWT",
	certs: {
		publicKey,
		privateKey
	}
});