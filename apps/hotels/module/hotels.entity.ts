import {
  Column,
  Entity,
	PrimaryGeneratedColumn,
	BeforeInsert
} from "https://raw.githubusercontent.com/denolib/typeorm/master/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { HotelRO } from "./dto/user-response.ts";

@Entity()
export class Hotel {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 30 })
  firstName!: string;

  @Column("varchar", { length: 30 })
  lastName!: string;

  @Column("varchar", { length: 70 })
  email!: string;

  @Column("varchar", { length: 255 })
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): HotelRO {
    const { id, firstName, lastName, email } = this;
    const responseObject: HotelRO = {
      id,
      firstName,
      lastName,
      email,
    };

    return responseObject;
  }

  toJSON() {
    return this.toResponseObject();
  }
}