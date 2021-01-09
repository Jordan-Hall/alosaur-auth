import { AutoInjectable, BadRequestError,  } from "../../../server-mods.ts";
import { DeleteResult, getCustomRepository } from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";
import { HotelRepository } from "./hotels.repository.ts";
import { Hotel } from "./hotels.entity.ts";
import { QueryDeepPartialEntity } from "https://deno.land/x/typeorm@v0.2.23-rc10/src/query-builder/QueryPartialEntity.ts";

@AutoInjectable()
export class UserService {
  private hotelRepository: HotelRepository;

  constructor() {
    this.hotelRepository = getCustomRepository(HotelRepository);
  }

  public async getAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find();
  }


  public async findById(id: number): Promise<Hotel | null> {
    return await this.hotelRepository.findOneOrFail(id);
  }

  public async create(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
    return await this.hotelRepository.save(hotel);
  }

  public async update(
    id: number,
    newValue: QueryDeepPartialEntity<Hotel>,
  ): Promise<Hotel | null> {
    const user = await this.hotelRepository.findOneOrFail(id);
    if (!user.id) {
      console.error("user doesn't exist");
    }
    await this.hotelRepository.update(id, newValue);
    return await this.hotelRepository.findOne(id) || null;
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.hotelRepository.delete(id);
  }

  // public async register(userDto: CreateUserDto): Promise<Hotel> {
  //   const { email } = userDto;
  //   let user = await this.hotelRepository.findOne({ where: { email } });
  //   if (user) {
  //     throw new BadRequestError(
  //       "User already exists",
  //     );
  //   }
  //   user = await this.hotelRepository.create(userDto);
  //   return await this.hotelRepository.save(user);
  // }
}