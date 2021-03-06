import { App, CorsBuilder } from 'https://deno.land/x/alosaur@v0.26.0/mod.ts';
import { AuthMiddleware } from "https://deno.land/x/alosaur@v0.26.0/src/security/authorization/src/auth.middleware.ts";
import { SessionMiddleware } from "https://deno.land/x/alosaur@v0.26.0/src/security/session/src/session.middleware.ts"
import { RedisSession } from "../../mods.ts"
import { AuthenticationArea } from "./controller/authentication.area.ts";
import { DAYS_30 } from "./environmental.ts";
import { JWTSchema } from "./jwtSchema.ts";


const app = new App({
	areas: [AuthenticationArea],
	logging: false,
});

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader(),
);

const sessionStore = new RedisSession({
  hostname: Deno.env.get('REDIS_HOST') || '"127.0.0.1',
  password: Deno.env.get('REDIS_PASSWORD'),
  port: Deno.env.get('REDIS_PORT'),
  name: Deno.env.get('REDIS_USERNAME')
});

await sessionStore.init();



const authMiddleware = new AuthMiddleware(
	[JWTSchema],
);

const sessionMiddleware = new SessionMiddleware(
  sessionStore,
  { secret: 1122n, maxAge: DAYS_30, path: "/" },
);

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);

app.useSecurityContext();

app.listen({port: 8005});
// app.listen();