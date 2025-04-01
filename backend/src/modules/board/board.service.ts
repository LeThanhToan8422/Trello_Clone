import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from './dtos/board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepository.create(createBoardDto);
    return await this.boardRepository.save(board);
  }

  async findByUserId(id: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: {
        userId: id,
      },
      relations: ['lists', 'lists.tasks'],
      order: {
        updatedAt: 'DESC',
        lists: {
          order: 'ASC',
          tasks: {
            order: 'ASC',
          },
        },
      },
    });
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ['lists', 'lists.tasks'],
      order: {
        updatedAt: 'DESC',
        lists: {
          order: 'ASC',
          tasks: {
            order: 'ASC',
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['lists', 'lists.tasks'],
      order: {
        lists: {
          order: 'ASC',
          tasks: {
            order: 'ASC',
          },
        },
      },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.findOne(id);
    Object.assign(board, updateBoardDto);
    return await this.boardRepository.save(board);
  }

  async remove(id: string): Promise<void> {
    const board = await this.findOne(id);
    await this.boardRepository.remove(board);
  }
}
