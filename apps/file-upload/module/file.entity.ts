import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from "https://deno.land/x/typeorm@v0.2.23-rc10/mod.ts";

@Entity()
export class FileEntity {
	@PrimaryGeneratedColumn()
	id!: number;

  @Column("varchar")
  fileName!: string;

	@Column("varchar")
	fileType!: string;

	@Column("varchar")
	url!: string;
}