import { PartialType } from '@nestjs/mapped-types';
import { PropertyEntity } from './property.entity';

export class CreatePropertyDto extends PartialType(PropertyEntity) {}

export class UpdatePropertyDto extends PartialType(PropertyEntity) {}
