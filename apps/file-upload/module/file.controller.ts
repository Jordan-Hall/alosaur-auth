import * as log from "https://deno.land/std/log/mod.ts";
import { BadRequestError, Body, Controller, Get, Post, Req, UseHook } from 'https://deno.land/x/alosaur@v0.26.0/mod.ts';
import { FormDataHook } from "../../../libs/alosaur/hooks/form-data-hook.ts";
import { FileService } from "./file.service.ts";


@Controller('/files')
export class FileController {

	constructor(private fileService: FileService) { }



	@UseHook(FormDataHook)
	@Post()
	formDataResponse(@Req() request: { serverRequest: Request }) {
		const formData: any = (request as any).formData;

		console.log('formData:', formData);

		return {}
	}
}