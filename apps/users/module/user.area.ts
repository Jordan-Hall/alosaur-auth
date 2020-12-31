import { Area } from "../../../server-mods.ts";
import { UserController } from "./user.controller.ts";

// Declare module
@Area({
  controllers: [
    UserController
  ],
  
})
export class UserArea {}