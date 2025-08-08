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
import { UnitService } from './unit.service';
import { CreateUnitDto, UpdateUnitDto } from './unit.dto';
import { UnitEntity } from './unit.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('units')
@UseGuards(JwtAuthGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  create(@Body() createUnitDto: CreateUnitDto): Promise<UnitEntity> {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  findAll(): Promise<UnitEntity[]> {
    return this.unitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UnitEntity> {
    return this.unitService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<UnitEntity> {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.unitService.remove(id);
  }
}
