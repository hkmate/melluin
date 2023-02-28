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

@Injectable()
export class ActivityEntityToWrappedDtoConverter implements Converter<Array<HospitalVisitActivityEntity>, WrappedHospitalVisitActivity> {

    constructor(private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly childConverter: ChildEntityToDtoConverter,
                private readonly visitEntityToDtoConverter: HospitalVisitEntityToDtoConverter) {
    }

    public convert(value: Array<HospitalVisitActivityEntity>): WrappedHospitalVisitActivity;
    public convert(value: undefined): undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): WrappedHospitalVisitActivity | undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): WrappedHospitalVisitActivity | undefined {
        if (isNilOrEmpty(value)) {
            return undefined;
        }
        return this.convertNotNil(value!);
    }

    private convertNotNil(entities: Array<HospitalVisitActivityEntity>): WrappedHospitalVisitActivity {
        this.verifyEntitiesAreFromTheVisit(entities);
        const groups = this.separateGroups(entities);
        return {
            hospitalVisit: this.visitEntityToDtoConverter.convert(entities[0].hospitalVisit),
            children: this.getDistinctChildren(entities).map(child => this.childConverter.convert(child)),
            activities: groups.map(group => this.basicDtoConverter.convert(group))
        }
    }

    private verifyEntitiesAreFromTheVisit(entities: Array<HospitalVisitActivityEntity>): void {
        if (isNilOrEmpty(entities)) {
            return;
        }
        const visitId = entities[0].hospitalVisit.id;
        const areVisitIdsSame = entities.every(entity => entity.hospitalVisit.id === visitId);
        if (!areVisitIdsSame) {
            throw new InternalServerErrorException('Activity objects has different visits');
        }
    }

    private getDistinctChildren(entities: Array<HospitalVisitActivityEntity>): Array<ChildEntity> {
        return entities.reduce<Array<ChildEntity>>((result, entitiy) => {
            const resultContainsThisChild = result.some(value => value.id === entitiy.childId);
            if (!resultContainsThisChild) {
                result.push(entitiy.child);
            }
            return result;
        }, []);
    }

    private separateGroups(entities: Array<HospitalVisitActivityEntity>): Array<Array<HospitalVisitActivityEntity>> {
        return Object.values(_.groupBy(entities, 'groupId'));
    }

}
