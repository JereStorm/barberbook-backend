import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  /**
 * Crea un nuevo service.
 * @param createServiceDto Datos del service a crear.
 * @returns Service creado.
 * @route POST /services
 */
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {

    try {
      const service = this.servicesService.create(createServiceDto);

      return {
        message: 'Service created successfully',
        data: service,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error creating service',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
     * Obtiene todos los services de un salón específico.
     * @param salonId ID del salón (query param).
     * @returns Lista de services.
     * @route GET /services?salonId=1
     */
  @Get()
  async findAll(@Query('salonId') salonId: string) {
    if (!salonId) {
      throw new HttpException(
        { message: 'Missing salonId query parameter' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const services = await this.servicesService.findAll(Number(salonId));
    return {
      message: 'Services fetched successfully',
      data: services,
    };
  }

  /**
     * Actualiza parcialmente un service por ID.
     * @param id ID del service (path param).
     * @param updateServiceDto Datos a actualizar.
     * @returns Service actualizado.
     * @route PATCH /services/:id
     */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    try {
      const updatedService = await this.servicesService.update(+id, updateServiceDto);
      return {
        message: 'Service updated successfully',
        data: updatedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating service',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
