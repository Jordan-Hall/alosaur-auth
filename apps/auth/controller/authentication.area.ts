import { Area } from "https://deno.land/x/alosaur@v0.26.0/mod.ts";
import { AuthenticationController } from "./authentication.ts";


@Area({
  controllers: [AuthenticationController],
})
export class AuthenticationArea {}