import { AutoInjectable, BadRequestError  } from "../../../server-mods.ts";
import { MongoRepository, getMongoRepository } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";
import { FileEntity } from "./file.entity.ts";

@AutoInjectable()
export class FileService {
  private fileRepository: MongoRepository<FileEntity>;

  constructor() {
    this.fileRepository = getMongoRepository(FileEntity);
  }
}