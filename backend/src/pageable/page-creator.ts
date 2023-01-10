import {Pageable, PageRequest} from '@shared/api-util/pageable';
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions';
import {FindOptionsOrder, ObjectLiteral, Repository} from 'typeorm';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {cast} from '@shared/util/test-util';
import {isNotNil} from '@shared/util/util';

// TODO place it to the right place
export interface EntityToDOConverter<Entity, DO> {
    convert(entity: Entity): DO;
}

// TODO place it to the right place
export interface PageRequestConverter<DO, Entity> {
    convert(entity: PageRequest<DO>): PageRequest<Entity>;
}

// TODO place it to the right place
export interface EntityFilterValidator<T> {
    validate(request: PageRequest<T>): void | never;
}

export abstract class PageCreator<T extends ObjectLiteral> {

    protected constructor(protected readonly repository: Repository<T>,
                          protected readonly whereClosureConverter: WhereClosureConverter) {
    }

    protected createOptions(pageRequest: PageRequest<T>): Partial<FindManyOptions<T>> {
        const result: Partial<FindManyOptions<T>> = {
            skip: pageRequest.page * pageRequest.size,
            take: pageRequest.size,
            order: cast<FindOptionsOrder<T>>(pageRequest.sort),
        };
        if (isNotNil(pageRequest.where)) {
            result.where = this.whereClosureConverter.convertFilterOptions(pageRequest.where)
        }
        return result;
    }

    protected createPage(content: Array<T>,
                         countOfAll: number,
                         originalRequest: PageRequest<T>): Pageable<T> {
        return {
            content,
            countOfAll,
            page: originalRequest.page,
            size: originalRequest.size,
            sort: originalRequest.sort
        };
    }

    protected async getPage(request: PageRequest<T>,
                            otherOptions: Partial<FindManyOptions<T>>): Promise<Pageable<T>> {
        const [content, count] = await this.repository.findAndCount({
            ...this.createOptions(request),
            ...otherOptions
        });
        return this.createPage(content, count, request);
    }

}

