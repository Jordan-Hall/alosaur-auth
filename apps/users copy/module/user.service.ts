import { AutoInjectable, BadRequestError,  } from "../../../server-mods";
import { DeleteResult, getCustomRepository } from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";
import { UserRepository } from "./user.repository.ts";
import { User } from "./user.entity.ts";
import { CreateUserDto } from "./dto/create-user.ts";

@AutoInjectable()
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }


  public async findByEmail(userEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({ email: userEmail }) || null;
  }

  public async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async update(
    id: number,
    newValue: CreateUserDto,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      console.error("user doesn't exist");
    }
    await this.userRepository.update(id, newValue);
    return await this.userRepository.findOne(id) || null;
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  public async register(userDto: CreateUserDto): Promise<User> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestError(
        "User already exists",
      );
    }
    user = await this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }
}