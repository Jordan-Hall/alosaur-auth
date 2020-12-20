import { Body, Controller, Ctx, Post, Get } from "https://deno.land/x/alosaur@v0.26.0/mod.ts";
import { AuthService, UserModel } from "../service/auth.service.ts";
import { SecurityContext } from "https://deno.land/x/alosaur@v0.26.0/src/security/context/security-context.ts";
import { Authorize } from "https://deno.land/x/alosaur@v0.26.0/src/security/authorization/mod.ts";
import { JWTSchema } from "../jwtSchema.ts";

interface LoginModel {
  login: string;
  password: string;
}

@Controller("/account")
export class AuthenticationController {

	constructor(private service: AuthService) { }

	@Post("/login")
  async postLogin(
    @Ctx() context: SecurityContext,
    @Body() account: LoginModel,
	) {
    const user = this.service.validate(account.login, account.password);

    if (user) {
      const result = await context.security.auth.signInAsync<UserModel, unknown>(JWTSchema, user);
      console.log(result);
      return result;
    }

		await context.request.serverRequest.respond({ status: 401 });
  }

  @Get("/logout")
  async logOut(@Ctx() context: SecurityContext) {
    await context.security.auth.signOutAsync(JWTSchema);
    await context.request.serverRequest.respond({ status: 401 });
  }

  @Authorize(JWTSchema)
  @Get("/protected")
  getProtectedData() {
    return "Hi! this protected info. <br>  <a href='/account/logout'>logout</a>";
  }


}