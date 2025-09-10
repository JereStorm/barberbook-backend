import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>,
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Clients> {
    const client = this.clientsRepository.create(createClientDto);
    return await this.clientsRepository.save(client);
  }

  async findAll(salonId: number): Promise<Clients[]> {
    return await this.clientsRepository.find({
      where: { salonId },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Clients> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientDto,
    });
    if (!client) {
      throw new Error(`Client with id ${id} not found`);
    }
    return await this.clientsRepository.save(client);
  }

  remove(id: number) {
    return `This action removes a #${id} client, and yet is unimplemented`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }
}
