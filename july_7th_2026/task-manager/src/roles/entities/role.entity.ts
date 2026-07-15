import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user-entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  description!: string;

  @Column({
    type: 'jsonb',
    default: {},
  })
  permissions?: Record<string, any>;

  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}