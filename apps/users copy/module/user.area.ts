import { Area } from "../../../server-mods";
import { UserController } from "./user.controller.ts";

// Declare module
@Area({
  controllers: [
    UserController
  ],

})
export class UserArea {}