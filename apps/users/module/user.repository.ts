import { Repository, EntityRepository } from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";
import { User } from "./user.entity.ts";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}