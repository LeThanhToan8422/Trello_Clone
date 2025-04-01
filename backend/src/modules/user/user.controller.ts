import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserService } from './user.service';
import * as CryptoJS from 'crypto-js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const bytes = CryptoJS.AES.decrypt(loginDto.password, 'secret key 123');
    loginDto.password = bytes.toString(CryptoJS.enc.Utf8);
    return this.userService.login(loginDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const bytes = CryptoJS.AES.decrypt(
      createUserDto.password,
      'secret key 123',
    );
    createUserDto.password = bytes.toString(CryptoJS.enc.Utf8);
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    if (updateUserDto.password) {
      const bytes = CryptoJS.AES.decrypt(
        updateUserDto.password,
        'secret key 123',
      );
      updateUserDto.password = bytes.toString(CryptoJS.enc.Utf8);
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
