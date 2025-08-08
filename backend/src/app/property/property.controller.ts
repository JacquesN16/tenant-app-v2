import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { PropertyEntity } from './property.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<PropertyEntity> {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  findAll(): Promise<PropertyEntity[]> {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PropertyEntity> {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<PropertyEntity> {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.propertyService.remove(id);
  }
}
