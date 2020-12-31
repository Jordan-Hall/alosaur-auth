import * as log from "https://deno.land/std/log/mod.ts";
import { BadRequestError, Body, Controller, Get, Post } from 'https://deno.land/x/alosaur@v0.26.0/mod.ts';
import { CreateUserDto } from "./dto/create-user.ts";
import { LoginUserDto } from "./dto/login-user.ts";
import { UserRO } from "./dto/user-response.ts";
import { User } from './user.entity.ts';
import { UserService } from './user.service.ts';

@Controller('/users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    async getAll(): Promise<UserRO[]> {
        let users: User[];

        try {
            users = await this.userService.getAll();
        } catch (error) {
            log.error(JSON.stringify(error));
            return error;
        }

        return users;
    }

    @Post('/login')
    async findByLogin(@Body(LoginUserDto) loginDTO: LoginUserDto): Promise<UserRO> {
        console.log('login details', loginDTO);
        try {
            const user = await this.userService.findByEmail(loginDTO.email);
            if ( user && await user?.comparePassword(loginDTO.password)) {
                return user.toResponseObject()
            }

            throw new BadRequestError("Incorrect login details");

        } catch (error) {
            console.log(error)
            return error;
        }
    }

    @Post()
    async create(@Body(CreateUserDto) user: CreateUserDto): Promise<User> {
        return await this.userService.register(user);
    }
}