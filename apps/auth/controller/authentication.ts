import { Body, Controller, Ctx, Post, Get } from "https://deno.land/x/alosaur@v0.26.0/mod.ts";
import { AuthService } from "../service/auth.service.ts";
import { SecurityContext } from "https://deno.land/x/alosaur@v0.26.0/src/security/context/security-context.ts";
import { Authorize } from "https://deno.land/x/alosaur@v0.26.0/src/security/authorization/mod.ts";
import { JWTSchema } from "../jwtSchema.ts";
import { UserRO } from "../../users/module/dto/user-response.ts";

interface LoginModel {
  username: string;
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
    const user = await this.service.validateUser(account.username, account.password);
    if (user) {
      const result = await context.security.auth.signInAsync<UserRO, unknown>(JWTSchema, user);
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
  @Post("/verify")
  verify(
    @Ctx() context: SecurityContext,
    @Body() account: LoginModel,
	) {
    return  { code: 200, description: "JWT Verified" }
  }

}