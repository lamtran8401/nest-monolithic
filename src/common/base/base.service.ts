import { PaginationToQuery } from '@common/helpers/paginationToQuery';
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationDto } from './base.dto';
import { BaseEntity } from './base.entity';

export abstract class BaseService<Entity extends BaseEntity> {
  abstract name: string;

  constructor(public readonly repo: Repository<Entity>) {}

  getAll(
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    ...relations: string[]
  ): Promise<Entity[]> {
    return this.repo.find({ where, relations });
  }

  getAllAdvanced(
    query: PaginationDto,
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    order?: FindOptionsOrder<Entity>,
    ...relations: string[]
  ): Promise<[Entity[], number]> {
    const { skip, take } = PaginationToQuery(query);
    return this.repo.findAndCount({ where, order, relations, skip, take });
  }

  // async getAllWithPagination(
  //   query: PaginationDto,
  //   where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  //   order?: FindOptionsOrder<Entity>,
  //   ...relations: string[]
  // ): Promise<[Entity[], number]> {
  //   const queryBuilder = getQueryBuilder(this.repo, query, where, order, ...relations);

  //   return queryBuilder.getManyAndCount();
  // }

  getOne(
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    ...relations: string[]
  ): Promise<Entity | null> {
    return this.repo.findOne({ where, relations });
  }

  create(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repo.create(data).save();
  }

  getOneById(id: number, ...relations: string[]): Promise<Entity | null> {
    const where = { id } as FindOptionsWhere<Entity>;
    return this.repo.findOne({ where, relations });
  }

  async getOneOrFail(
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity> {
    const entity = await this.repo.findOne({ where });
    if (!entity) {
      const errorMessage = `${this.name} not found`;
      throw new NotFoundException(errorMessage);
    }
    return entity;
  }

  async getOneByIdOrFail(id: number, ...relations: string[]): Promise<Entity> {
    const where = { id } as FindOptionsWhere<Entity>;
    const entity = await this.repo.findOne({ where, relations });
    if (!entity) {
      const errorMessage = `${this.name} not found`;
      throw new NotFoundException(errorMessage);
    }
    return entity;
  }

  async createMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const result: Entity[] = [];
    const newEntities = this.repo.create(data);
    for (let i = 0; i < newEntities.length; i++) {
      const newEntity = await newEntities[i].save();
      result.push(newEntity);
    }
    return result;
  }

  async update(entity: Entity, data: QueryDeepPartialEntity<Entity>) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      entity[key] = data[key];
    }
    return entity.save();
  }

  async updateBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    data: QueryDeepPartialEntity<Entity>,
  ) {
    const entity = await this.getOneOrFail(where);
    return this.update(entity, data);
  }

  async updateById(id: number, data: QueryDeepPartialEntity<Entity>) {
    const entity = await this.getOneByIdOrFail(id);
    return this.update(entity, data);
  }

  async deleteBy(where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]) {
    const entity = await this.getOneOrFail(where);
    return this.repo.remove(entity);
  }

  async deleteById(id: number) {
    const entity = await this.getOneByIdOrFail(id);
    return this.repo.remove(entity);
  }

  async softDelete(where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]) {
    const entity = await this.getOneOrFail(where);
    return this.repo.softRemove(entity);
  }

  async softDeleteById(id: number) {
    const entity = await this.getOneByIdOrFail(id);
    return this.repo.softRemove(entity);
  }
}
