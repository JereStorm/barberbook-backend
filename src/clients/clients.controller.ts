import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      const client = await this.clientsService.create(createClientDto);
      return {
        message: 'Client created successfully',
        data: client,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error creating client',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Query('salonId') salonId: string) {
    if (!salonId) {
      throw new HttpException(
        { message: 'Missing salonId query parameter' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clients = await this.clientsService.findAll(Number(salonId));
    return {
      message: 'Clients fetched successfully',
      data: clients,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientsService.update(+id, updateClientDto);
      return {
        message: 'Client updated successfully',
        data: updatedClient,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating client',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }
}
