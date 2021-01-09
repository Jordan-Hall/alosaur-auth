import { Area } from "../../../server-mods.ts";
import { FileController } from "./file.controller.ts";

// Declare module
@Area({
	controllers: [
		FileController
	],

})
export class FileArea { }