import { App, CorsBuilder } from "../../server-mods";
import transformer from "https://jspm.dev/class-transformer@0.2.3";
import { initTypeORM } from "./loader/init-typeorm";
import { UserArea } from "./module/user.area";

// deno-lint-ignore no-explicit-any
const { plainToClass } = transformer as any;

await initTypeORM();

// Create alosaur application
const app = new App({
  areas: [UserArea],
});

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader(),
);

app.useTransform({
  type: "body", // parse body params
  getTransform: (transform: unknown, body: unknown) => {
    return plainToClass(transform, body);
  },
});

app.listen();