import { Repository, EntityRepository } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";
import { User } from "./user.entity.ts";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}