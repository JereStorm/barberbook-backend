//user.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { CurrentUser } from '../../common/interfaces/current-user.interface';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto, currentUser);
    return plainToClass(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findAll(@GetCurrentUser() currentUser: CurrentUser): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll(currentUser);
    return plainToClass(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id, currentUser);
    return plainToClass(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto, currentUser);
    return plainToClass(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id, currentUser);
    return { message: 'Usuario eliminado correctamente' };
  }
}