import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {VisitedChildEntityToDtoConverter} from '@be/hospital-visit-children/converer/visited-child-entity-to-dto.converter';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';

export interface WrappedHospitalVisitEntities {
    visit: HospitalVisitEntity;
    activities: Array<HospitalVisitActivityEntity>;
    children: Array<VisitedChildEntity>;
}


@Injectable()
export class ActivityEntityToWrappedDtoConverter implements Converter<WrappedHospitalVisitEntities, Promise<WrappedHospitalVisitActivity>> {

    constructor(private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly childConverter: VisitedChildEntityToDtoConverter,
                private readonly visitEntityToDtoConverter: HospitalVisitEntityToDtoConverter) {
    }

    public convert(value: WrappedHospitalVisitEntities): Promise<WrappedHospitalVisitActivity>;
    public convert(value: undefined): undefined;
    public convert(value?: WrappedHospitalVisitEntities): Promise<WrappedHospitalVisitActivity> | undefined;
    public convert(value?: WrappedHospitalVisitEntities): Promise<WrappedHospitalVisitActivity> | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return Promise.resolve(this.convertNotNil(value));
    }

    private convertNotNil(entities: WrappedHospitalVisitEntities): WrappedHospitalVisitActivity {
        this.verifyEntitiesAreFromTheSameVisit(entities.activities);

        const hospitalVisit = entities.visit;
        const children = entities.children;
        return {
            hospitalVisit: this.visitEntityToDtoConverter.convert(hospitalVisit),
            children: children.map(visitedChildEntity => this.childConverter.convert(visitedChildEntity)),
            activities: entities.activities.map(group => this.basicDtoConverter.convert(group))
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

}
