import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  token: string;

  @Column()
  type: string;

  @Column("timestamp")
  expire_in: string;

  @Column("uuid")
  user_id: string;

  @Column({ default: false })
  used: boolean;
}
