import * as bcrypt from 'bcryptjs';
import { Role } from '../../role-management/entities/role.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ACCOUNT_TYPE, GENDER } from 'src/common/interfaces';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: true })
  profile_pic: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column('enum', { enum: ACCOUNT_TYPE, nullable: true })
  account_type: string;

  @Column('enum', { enum: GENDER, nullable: true })
  gender: string;

  @Column({ nullable: true })
  state_of_origin: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false, select: false })
  locked: boolean;

  @Column({ default: false })
  activated: boolean;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  last_login: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: string;

  @DeleteDateColumn({
    nullable: true, select: false
  })
  deleted_at: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // ENTITY METHOD
  isSamePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  toJson() {
    return { ...this };
  }
}
