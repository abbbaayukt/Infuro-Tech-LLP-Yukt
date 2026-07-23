import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Ticket } from '../../support/entities/ticket.entity'
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  username!: string;
  @Exclude()
  @Column()
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  @ManyToOne(
    () => Role,
    (role) => role.users,
  )
  role!: Role;

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.user,
  )
  tickets!: Ticket[];

  @Column({ default: 0 })
  failedLoginAttempts!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lockedUntil!: Date | null;
}