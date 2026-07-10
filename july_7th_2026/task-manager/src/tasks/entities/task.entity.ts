import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user-entity';
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title!: string;

  @Column({ default: false })
  completed?: boolean;

  @ManyToOne(
      () => User,
      (user) => user.tasks,
    )
  user?: User;
}