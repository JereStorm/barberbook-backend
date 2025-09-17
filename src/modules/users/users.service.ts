//user.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser } from '../../common/interfaces/current-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser: CurrentUser): Promise<User> {
    if (!this.canCreateRole(currentUser.role, createUserDto.role)) {
      throw new ForbiddenException(
        `No tienes permisos para crear un usuario con rol ${createUserDto.role}`
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    let salonId: number | null = null;
    
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      // Super admin puede crear usuarios para cualquier salón
      salonId = null;
    } else {
      // Admin y Recepcionista solo pueden crear usuarios para su propio salón
      salonId = currentUser.salonId;
    }

    if (createUserDto.role === UserRole.SUPER_ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Solo un Super Admin puede crear otro Super Admin');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash,
      salonId,
      createdBy: currentUser.id,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(currentUser: CurrentUser): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.salon', 'salon')
      .leftJoinAndSelect('user.creator', 'creator');

    if (currentUser.role === UserRole.SUPER_ADMIN) {
      // Super admin ve todos los usuarios
    } else {
      // Otros roles solo ven usuarios de su propio salón
      query.where('user.salonId = :salonId', { salonId: currentUser.salonId });
    }

    const users = await query.getMany();
    
    // Este log, lo utilice para verificar algo----->borrar despues
    console.log('Usuarios con salon:', users.map(u => ({
      id: u.id,
      name: u.name,
      salonId: u.salonId,
      salon: u.salon
    })));

    return users;
  }

  async findOne(id: number, currentUser: CurrentUser): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['salon', 'creator'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!this.canAccessUser(currentUser, user)) {
      throw new ForbiddenException('No tienes permisos para ver este usuario');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: CurrentUser): Promise<User> {
    const user = await this.findOne(id, currentUser);

    if (!this.canModifyUser(currentUser, user)) {
      throw new ForbiddenException('No tienes permisos para modificar este usuario');
    }

    if (updateUserDto.role && updateUserDto.role !== user.role) {
      if (!this.canCreateRole(currentUser.role, updateUserDto.role)) {
        throw new ForbiddenException(
          `No tienes permisos para asignar el rol ${updateUserDto.role}`
        );
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con ese email');
      }
    }

    const updateData: any = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      mobile: updateUserDto.mobile,
      role: updateUserDto.role,
      isActive: updateUserDto.isActive,
    };

    // Si se está cambiando la contraseña, hashearla
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    // Actualizar
    await this.userRepository.update(id, updateData);

    return await this.findOne(id, currentUser);
  }

  async remove(id: number, currentUser: CurrentUser): Promise<void> {
    const user = await this.findOne(id, currentUser);

    if (user.id === currentUser.id) {
      throw new BadRequestException('No puedes eliminar tu propio usuario');
    }

    if (!this.canModifyUser(currentUser, user)) {
      throw new ForbiddenException('No tienes permisos para eliminar este usuario');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('No se puede eliminar un Super Admin, solo desactivar');
    }

    await this.userRepository.remove(user);
  }

  // Método para encontrar por email (usado en auth)
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['salon'],
    });
  }

  // === MÉTODOS PRIVADOS DE VALIDACIÓN ===

  private canCreateRole(currentRole: UserRole, targetRole: UserRole): boolean {
    switch (currentRole) {
      case UserRole.SUPER_ADMIN:
        return true;
      case UserRole.ADMIN:
        return [UserRole.RECEPCIONISTA, UserRole.ESTILISTA].includes(targetRole);
      case UserRole.RECEPCIONISTA:
        return targetRole === UserRole.ESTILISTA;
      default:
        return false;
    }
  }

  private canAccessUser(currentUser: CurrentUser, targetUser: User): boolean {
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    return currentUser.salonId === targetUser.salonId;
  }

  private canModifyUser(currentUser: CurrentUser, targetUser: User): boolean {
    // Super admin puede modificar a cualquiera excepto a otros super admins
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return targetUser.role !== UserRole.SUPER_ADMIN || currentUser.id === targetUser.id;
    }

    // Debe ser del mismo salón
    if (currentUser.salonId !== targetUser.salonId) {
      return false;
    }

    // Admin puede modificar recepcionistas y estilistas
    if (currentUser.role === UserRole.ADMIN) {
      return [UserRole.RECEPCIONISTA, UserRole.ESTILISTA].includes(targetUser.role);
    }

    // Recepcionista solo puede modificar estilistas
    if (currentUser.role === UserRole.RECEPCIONISTA) {
      return targetUser.role === UserRole.ESTILISTA;
    }

    return false;
  }
}