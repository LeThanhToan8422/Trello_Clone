import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { List } from '../../list/entities/list.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  listId: string;

  @Column()
  boardId: string;

  @Column('json', { nullable: true })
  label: {
    text: string;
    color: string;
  };

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => List, (list) => list.tasks)
  @JoinColumn({ name: 'listId' })
  list: List;
}
