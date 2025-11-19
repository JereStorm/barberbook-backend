import { PartialType } from "@nestjs/mapped-types";
import { CreateAppointmentDto } from "./create-appointment.dto";
import { IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
	@IsOptional()
	@IsNumber()
	updatedBy?: number;

	@IsOptional()
	@IsDateString()
	updatedAt?: string;
}
