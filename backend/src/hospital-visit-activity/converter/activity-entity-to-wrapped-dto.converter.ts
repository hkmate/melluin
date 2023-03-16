import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {isNilOrEmpty} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {ChildEntityToDtoConverter} from '@be/child/converer/child-entity-to-dto.converter';
import {ChildEntity} from '@be/child/model/child.entity';
import * as _ from 'lodash';
import {ChildDao} from '@be/child/child.dao';
import {Child} from '@shared/child/child';

@Injectable()
export class ActivityEntityToWrappedDtoConverter implements Converter<Array<HospitalVisitActivityEntity>, Promise<WrappedHospitalVisitActivity>> {

    constructor(private readonly childDao: ChildDao,
                private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly childConverter: ChildEntityToDtoConverter,
                private readonly visitEntityToDtoConverter: HospitalVisitEntityToDtoConverter) {
    }

    public convert(value: Array<HospitalVisitActivityEntity>): Promise<WrappedHospitalVisitActivity>;
    public convert(value: undefined): undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): Promise<WrappedHospitalVisitActivity> | undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): Promise<WrappedHospitalVisitActivity> | undefined {
        if (isNilOrEmpty(value)) {
            return undefined;
        }
        return this.convertNotNil(value!);
    }

    private async convertNotNil(entities: Array<HospitalVisitActivityEntity>): Promise<WrappedHospitalVisitActivity> {
        this.verifyEntitiesAreFromTheSameVisit(entities);

        const children = await this.getChildren(entities);
        return {
            hospitalVisit: this.visitEntityToDtoConverter.convert(entities[0].hospitalVisit),
            children,
            activities: entities.map(group => this.basicDtoConverter.convert(group))
        }
    }

    private verifyEntitiesAreFromTheSameVisit(entities: Array<HospitalVisitActivityEntity>): void {
        if (isNilOrEmpty(entities)) {
            return;
        }
        const visitId = entities[0].hospitalVisit.id;
        const areVisitIdsSame = entities.every(entity => entity.hospitalVisit.id === visitId);
        if (!areVisitIdsSame) {
            throw new InternalServerErrorException('Activity objects are from different visits');
        }
    }

    private async getChildren(entities: Array<HospitalVisitActivityEntity>): Promise<Array<Child>> {
        const childEntities = await this.getChildEntities(entities);
        return childEntities.map(e => this.childConverter.convert(e));
    }

    private async getChildEntities(entities: Array<HospitalVisitActivityEntity>): Promise<Array<ChildEntity>> {
        return await this.childDao.findByIds(this.getDistinctChildrenIds(entities));
    }

    private getDistinctChildrenIds(entities: Array<HospitalVisitActivityEntity>): Array<string> {
        return _.union(entities.flatMap(entity => entity.children.map(child => child.childId)));
    }

}
