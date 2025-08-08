import { PartialType } from '@nestjs/mapped-types';
import { UnitEntity } from './unit.entity';

export class CreateUnitDto extends PartialType(UnitEntity) {}

export class UpdateUnitDto extends PartialType(UnitEntity) {}
