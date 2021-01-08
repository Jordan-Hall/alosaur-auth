import { Repository, EntityRepository } from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";
import { Hotel } from "./hotels.entity.ts";

@EntityRepository(Hotel)
export class HotelRepository extends Repository<Hotel> {
}