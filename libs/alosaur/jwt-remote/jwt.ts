import { AuthClaims, AuthenticationScheme, Identity } from "https://deno.land/x/alosaur@v0.26.0/src/security/authentication/core/mod.ts";
import { Content } from "https://deno.land/x/alosaur@v0.26.0/mod.ts";
import { SecurityContext } from "https://deno.land/x/alosaur@v0.26.0/src/security/context/security-context.ts";
import { decode } from "https://deno.land/x/djwt@v2.0/mod.ts";

const AuthorizationHeader = "Authorization";
const AcceptHeader = "Accept";
const AcceptTypeJSON = "application/json";

export class LibertyRemoteJWTSchema implements AuthenticationScheme  {

	constructor( protected remoteServer: string ) {}


	async authenticate(context: SecurityContext): Promise<void> {
		const token = this.getToken(context);
		if (token) {
			const response = await fetch(`${this.remoteServer}/account/verify`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
			if (response.status !== 401) {
				const { payload } = decode(token);
				context.security.auth.identity = <T>() => payload as unknown as Identity<T>;
			}

		}

    return undefined;
  }

	public signInAsync<I, R>(
    context: SecurityContext,
    identity: Identity<I>,
		claims: AuthClaims = {},
	): Promise<R> {
		throw new Error('guard only');
	}

	signOutAsync<T, R>(context: SecurityContext): Promise<R>  {
		throw new Error('guard only');
	}

	onFailureResult(context: SecurityContext): void {
    context.response.result = Content({ status: 401 }, 401);
    context.response.setImmediately();
  }

  onSuccessResult(context: SecurityContext): void {
    // nothing
  }

	private getToken(context: SecurityContext) {
		const headers = context.request.serverRequest.headers;

		const headAuthorization = headers.get(AuthorizationHeader);
		const headAccept = headers.get(AcceptHeader);

		if (headAccept === AcceptTypeJSON && headAuthorization) {
			return getBearerToken(headAuthorization);
		}
	}
}

function getBearerToken(authHeader: string): string | undefined {
  const head = authHeader.substr(0, 7);
  const token = authHeader.slice(7);

  if (head === "Bearer ") {
    return token;
  }

  return undefined;
}
