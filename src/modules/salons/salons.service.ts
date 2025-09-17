import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Salon } from './entities/salon.entity';
import { User } from '../users/entities/user.entity';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser } from '../../common/interfaces/current-user.interface';

// Aca se manejan las validaciones y la interaccion con la base de datos para crear,
// buscar, actualizar y borrar salones.
@Injectable()
export class SalonsService {
  // Aca inyectamos los repositorios que vamos a usar para interactuar con las tablas 'Salon' y 'User'.
  // Tambien inyectamos 'DataSource' para poder usar transacciones.
  constructor(
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  // Este metodo crea un salon y su administrador en una unica operacion.
  async create(createSalonDto: CreateSalonDto, currentUser: CurrentUser): Promise<Salon> {
    // La primera validacion es de permisos, solo el 'super_admin' puede hacer esto.
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Solo el Super Admin puede crear salones');
    }

    // Aca chequeamos si ya existe un salon con ese nombre.
    const existingSalon = await this.salonRepository.findOne({
      where: { name: createSalonDto.name },
    });

    if (existingSalon) {
      throw new ConflictException('Ya existe un salón con ese nombre');
    }

    // Tambien nos fijamos que el email del administrador que se quiere crear no este ya en uso.
    const existingUser = await this.userRepository.findOne({
      where: { email: createSalonDto.admin.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    // Usamos una transaccion de TypeORM-----> si falla la creacion
    // del admin, no se va a guardar tampoco el salon. 
    return await this.dataSource.transaction(async (manager) => {
      // 1. Crear el salon.
      const salon = manager.create(Salon, {
        name: createSalonDto.name,
        address: createSalonDto.address,
        mobile: createSalonDto.mobile,
      });

      const savedSalon = await manager.save(salon);

      // 2. Crear el administrador del salon.
      // Aca hasheamos la contrasena antes de guardarla--->bs
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(createSalonDto.admin.password, saltRounds);

      const admin = manager.create(User, {
        salonId: savedSalon.id,
        name: createSalonDto.admin.name,
        email: createSalonDto.admin.email,
        mobile: createSalonDto.admin.mobile,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
        createdBy: currentUser.id,
      });

      await manager.save(admin);

      // 3. Devolvemos el salon recien creado, pero con la lista de usuarios cargada (en este caso, solo el admin).
      const salonWithUsers = await manager.findOne(Salon, {
        where: { id: savedSalon.id },
        relations: ['users'],
      });

      if (!salonWithUsers) {
        throw new Error('Error al crear el salón');
      }

      return salonWithUsers;
    });
  }

  // Este metodo busca todos los salones.
  async findAll(currentUser: CurrentUser): Promise<Salon[]> {
    // Aca nos aseguramos de que solo el 'super_admin' tenga permiso para ver la lista completa.
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Solo el Super Admin puede ver todos los salones');
    }

    // Devolvemos todos los salones, incluyendo sus usuarios--->se ordenan por fecha
    return await this.salonRepository.find({
      relations: ['users'],
      order: { createdAt: 'DESC' },
    });
  }

  // Este metodo busca un salon por su ID.
  async findOne(id: number, currentUser: CurrentUser): Promise<Salon> {
    const salon = await this.salonRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!salon) {
      throw new NotFoundException('Salón no encontrado');
    }

    // Aca usamos un metodo privado para chequear los permisos de acceso.
    if (!this.canAccessSalon(currentUser, salon)) {
      throw new ForbiddenException('No tienes permisos para ver este salón');
    }

    return salon;
  }

  // Este metodo actualiza un salon.
  async update(id: number, updateSalonDto: UpdateSalonDto, currentUser: CurrentUser): Promise<Salon> {
    // Primero, nos fijamos si el salon existe y si el usuario tiene permiso para modificarlo.
    const salon = await this.findOne(id, currentUser);

    // Si el usuario no puede modificarlo, tira error.
    if (!this.canModifySalon(currentUser, salon)) {
      throw new ForbiddenException('No tienes permisos para modificar este salón');
    }

    // Si el nombre del salon esta cambiando, nos fijamos que el nuevo nombre no este ya en uso.
    if (updateSalonDto.name && updateSalonDto.name !== salon.name) {
      const existingSalon = await this.salonRepository.findOne({
        where: { name: updateSalonDto.name },
      });

      if (existingSalon) {
        throw new ConflictException('Ya existe un salón con ese nombre');
      }
    }

    // Aca actualizamos el salon y luego lo volvemos a buscar para devolver los datos completos.
    await this.salonRepository.update(id, updateSalonDto);
    return await this.findOne(id, currentUser);
  }

  // Este metodo borra un salon.
  async remove(id: number, currentUser: CurrentUser): Promise<void> {
    // La primera y unica validacion de permisos es que solo el 'super_admin' puede borrar salones.
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Solo el Super Admin puede eliminar salones');
    }

    // Nos aseguramos de que el salon que se quiere borrar exista.
    const salon = await this.findOne(id, currentUser);

    // Aca nos fijamos si el salon tiene usuarios activos. Si los tiene, no lo dejamos borrar.
    const activeUsersCount = await this.userRepository.count({
      where: { salonId: id, isActive: true },
    });

    if (activeUsersCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el salón porque tiene ${activeUsersCount} usuario(s) activo(s). Desactívelos primero.`
      );
    }

    // Si todo esta bien, borramos el salon.
    await this.salonRepository.remove(salon);
  }

  // Este es un metodo para obtener el salon del usuario, lo usamos en el controlador de 'my-salon'.
  async getCurrentUserSalon(currentUser: CurrentUser): Promise<Salon | null> {
    if (!currentUser.salonId) {
      return null;
    }

    return await this.salonRepository.findOne({
      where: { id: currentUser.salonId },
      relations: ['users'],
    });
  }

  // === METODOS PRIVADOS DE VALIDACION ===
  // Los usamos en los metodos publicos del servicio para no repetir codigo.

  private canAccessSalon(currentUser: CurrentUser, salon: Salon): boolean {
    // El 'super_admin' siempre tiene acceso.
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // El resto de los usuarios solo puede ver su propio salon.
    return currentUser.salonId === salon.id;
  }

  private canModifySalon(currentUser: CurrentUser, salon: Salon): boolean {
    // El 'super_admin' puede modificar cualquier salon.
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // El 'admin' solo puede modificar su propio salon.
    if (currentUser.role === UserRole.ADMIN && currentUser.salonId === salon.id) {
      return true;
    }

    return false;
  }
}