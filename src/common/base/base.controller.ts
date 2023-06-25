import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FindOptionsOrder } from 'typeorm';
import { PaginationDto } from './base.dto';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';

export abstract class BaseController<Entity extends BaseEntity> {
  abstract relations: string[];
  constructor(public readonly service: BaseService<Entity>) {}

  @Post()
  create(@Body() body): Promise<Entity> {
    return this.service.create(body);
  }

  @Get()
  getAll(@Query() query: PaginationDto): Promise<[Entity[], number]> {
    const orderOptions = { createdAt: 'DESC' } as FindOptionsOrder<Entity>;
    return this.service.getAllWithPagination(query, {}, orderOptions, ...this.relations);
  }

  @Get(':id')
  getDetail(@Param('id') id: number): Promise<Entity> {
    return this.service.getOneByIdOrFail(id, ...this.relations);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: Partial<Entity>): Promise<Entity> {
    return this.service.updateById(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<Entity> {
    return this.service.softDeleteById(id);
  }
}
