import { AuthClaims, AuthenticationScheme, Identity } from "https://deno.land/x/alosaur@v0.26.0/src/security/authentication/core/mod.ts";
import { Content } from "https://deno.land/x/alosaur@v0.26.0/mod.ts";
import { SecurityContext } from "https://deno.land/x/alosaur@v0.26.0/src/security/context/security-context.ts";
import { verify as verifySignature } from "https://deno.land/x/djwt@v2.0/signature.ts";
import { create, decode, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";
import { Algorithm } from "https://deno.land/x/djwt@v2.0/algorithm.ts";

export const IdentityKey = "__identity_jwt";
const AuthorizationHeader = "Authorization";
const AcceptHeader = "Accept";
const AcceptTypeJSON = "application/json";

export class LibertyJWTSchema implements AuthenticationScheme  {

	constructor(
		protected readonly algorithm: Algorithm,
		protected readonly expires: number = (30 * 24 * 60 * 60 * 1000),
		protected readonly options: { certs?: { publicKey: string, privateKey: string}, type: string, secret?: string  }
	) {
	}


	async authenticate(context: SecurityContext): Promise<void> {
		const token = this.getToken(context);
		if (token) {
			const payload = await safeVerifyJWT(token, this.options.secret ? this.options.secret : this.options.certs?.publicKey as string);

			if (payload) {
				const session = context.security.session;
				const currentSessions = await session?.get<{ [key: string]: string }>(IdentityKey);

				if (currentSessions && currentSessions[payload.id]?.includes(token)) {
					context.security.auth.identity = <T>() => payload as Identity<T>;
				}
			}
		}

    return undefined;
  }

	public async signInAsync<I, R>(
    context: SecurityContext,
    identity: Identity<I>,
		claims: AuthClaims = {},
	): Promise<R> {
		console.log('user', identity);
		const jwt = await create(
			{ alg: this.algorithm, typ: this.options.type || 'JWT'  },
			{ exp: getNumericDate(this.expires), ...identity},
			this.options.secret ? this.options.secret : this.options.certs?.privateKey as string,
		);
		context.security.auth.identity = () => identity as never;
		const session = context.security.session;
		const currentSessions = await session?.get<{ [key: string]: string }>(IdentityKey);

		if (jwt) {
			await session?.set(IdentityKey, {
				...currentSessions,
				[identity.id]: [
					...((currentSessions || {})[identity.id] || []),
					jwt,
				],
			});
		}

		return { access_token: jwt } as unknown as Promise<R>;
	}

	async signOutAsync<T, R>(context: SecurityContext): Promise<R> {
		const session = context.security.session;
		const identity: Identity<unknown> = context.security.auth.identity() as Identity<unknown>;
		const loggedInToken = this.getToken(context);
		const currentSessions = await session?.get<{ [key: string]: string[] }>(IdentityKey);
		if (currentSessions) {
			await session?.set(IdentityKey, {
				...currentSessions,
				[identity.id]: currentSessions[identity.id]?.filter(token => token !== loggedInToken)
			});
		}
		return <unknown> true as R;
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

async function safeVerifyJWT(
	jwt: string,
	key: string,
): Promise<Identity<unknown> | undefined> {
	const { header, payload, signature } = decode(jwt);

	if (
		!(await verifySignature({
			signature,
			key,
			algorithm: header.alg,
			signingInput: jwt.slice(0, jwt.lastIndexOf(".")),
		}))
	) {
		return undefined;
	}

	return payload as unknown as Identity<unknown>;
}