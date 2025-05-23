import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];
}
