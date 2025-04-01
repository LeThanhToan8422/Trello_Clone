import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Board } from '../../board/entities/board.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  order: number;

  @Column()
  boardId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Board, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @OneToMany(() => Task, (task) => task.list, {
    onDelete: 'CASCADE',
  })
  tasks: Task[];
}
