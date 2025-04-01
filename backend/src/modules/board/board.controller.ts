import { userI } from './../../interfaces/user.interface';
import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto, UpdateBoardDto } from './dtos/board.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { log } from 'console';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: Request) {
    const payload = req.user as userI;
    const boardDto = plainToInstance(CreateBoardDto, {
      ...req.body,
      userId: payload.id,
    });
    return this.boardService.create(boardDto);
  }

  @UseGuards(AuthGuard)
  @Get('user/id')
  findByUserId(@Req() req: Request) {
    const payload = req.user as userI;
    return this.boardService.findByUserId(payload.id);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}
