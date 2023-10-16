import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinTable,
  ManyToMany,
  BeforeInsert,
  Index,
  BeforeUpdate,
} from "typeorm";

import { User } from "../../user/entities/user.entity";
import { Permission } from "./permission.entity";
import { toTsVector } from "src/common/utils";

export enum ActiveStatusEnum {
  INACTIVE = 'inactive',
  ACTIVE = 'active'
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('tsvector', { select: false })
  @Index({ fulltext: true })
  name_token: string;

  @Column({ nullable: true })
  description: string;

  @Column('tsvector', { select: false, nullable: true })
  @Index({ fulltext: true })
  description_token: string;

  @Column({
    type: "enum",
    nullable: false,
    enum: ActiveStatusEnum,
    default: "active",
  })
  status: string;

  @Column({ nullable: false, default: 0 })
  member_count: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: true,
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @ManyToMany((user) => User, (user) => user.roles, { onDelete: "CASCADE" })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
    cascade: ['insert']
  })
  @JoinTable({
    name: "roles_permission",
  })
  permissions: Permission[];

  // HOOKS
  @BeforeInsert()
  async setTsVector() {
    const [descriptionToken, nameToken] = await Promise.all([
      await toTsVector(this.description),
      await toTsVector(this.name)
    ]);

    this.description_token = descriptionToken;
    this.name_token = nameToken;
  }

  @BeforeUpdate()
  async setUpdatedTsVector() {
  }
}
