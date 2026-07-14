import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
  })
  username!: string;
  @Exclude()
  @Column()
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];

  @ManyToOne(
    () => Role,
    (role) => role.users,
  )
  role!: Role;

  @Column({
    type: 'jsonb',
    default: {},
  })
  permissionOverride?: Record<string, any>;
}