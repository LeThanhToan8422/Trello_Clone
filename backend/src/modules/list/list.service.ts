import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { CreateListDto, UpdateListDto } from './dtos/list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const list = this.listRepository.create(createListDto);
    return await this.listRepository.save(list);
  }

  async findAll(): Promise<List[]> {
    return await this.listRepository.find({
      relations: ['board', 'tasks'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['board', 'tasks'],
    });
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
    return list;
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.findOne(id);
    Object.assign(list, updateListDto);
    return await this.listRepository.save(list);
  }

  async remove(id: string): Promise<void> {
    const list = await this.findOne(id);
    await this.listRepository.remove(list);
  }

  async findByBoardId(boardId: string): Promise<List[]> {
    return await this.listRepository.find({
      where: { boardId },
      relations: ['tasks'],
      order: { order: 'ASC' },
    });
  }
}
