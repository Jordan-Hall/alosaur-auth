import { Area } from "../../../server-mods.ts";
import { HotelsController } from "./hotels.controller.ts";

// Declare module
@Area({
  controllers: [
    HotelsController
  ],

})
export class HotelsArea {}