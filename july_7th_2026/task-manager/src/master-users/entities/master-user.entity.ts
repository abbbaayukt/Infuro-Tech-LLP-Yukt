import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  schema: 'public',
  name: 'master_users',
})
export class MasterUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;
  
  @Column()
  tenantId!: string;

  @Column()
  tenantName!: string;

  @Column()
  username!: string;

  @Column()
  roleName!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}