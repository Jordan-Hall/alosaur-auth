import { Repository, EntityRepository } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";
import { Hotel } from "./hotels.entity.ts";

@EntityRepository(Hotel)
export class HotelRepository extends Repository<Hotel> {
}