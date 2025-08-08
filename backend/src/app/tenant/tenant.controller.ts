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
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto } from './tenant.dto';
import { TenantEntity } from './tenant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll(): Promise<TenantEntity[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantEntity> {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tenantService.remove(id);
  }
}
