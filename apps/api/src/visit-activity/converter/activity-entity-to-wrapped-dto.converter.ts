import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {Converter, isNil, isNilOrEmpty, WrappedVisitActivity} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';
import {ActivityEntityToBasicDtoConverter} from '@be/visit-activity/converter/activity-entity-to-basic-dto.converter';
import {VisitEntityToDtoConverter} from '@be/visit/converer/visit-entity-to-dto.converter';
import {VisitedChildEntityToDtoConverter} from '@be/visit-children/converer/visited-child-entity-to-dto.converter';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitedChildEntity} from '@be/visit-children/persistence/model/visited-child.entity';
import {VisitActivityInfoEntity} from '@be/visit-activity-info/model/visit-activity-info.entity';
import {ActivityInfoEntityToDtoConverter} from '@be/visit-activity-info/converter/activity-info-entity-to-dto.converter';

export interface WrappedVisitEntities {
    visit: VisitEntity;
    activities: Array<VisitActivityEntity>;
    children: Array<VisitedChildEntity>;
    info: VisitActivityInfoEntity;
}


@Injectable()
export class ActivityEntityToWrappedDtoConverter implements Converter<WrappedVisitEntities, Promise<WrappedVisitActivity>> {

    constructor(private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly childConverter: VisitedChildEntityToDtoConverter,
                private readonly infoConverter: ActivityInfoEntityToDtoConverter,
                private readonly visitEntityToDtoConverter: VisitEntityToDtoConverter) {
    }

    public convert(value: WrappedVisitEntities): Promise<WrappedVisitActivity>;
    public convert(value: undefined): undefined;
    public convert(value?: WrappedVisitEntities): Promise<WrappedVisitActivity> | undefined;
    public convert(value?: WrappedVisitEntities): Promise<WrappedVisitActivity> | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return Promise.resolve(this.convertNotNil(value));
    }

    private convertNotNil({activities, children, info, visit}: WrappedVisitEntities): WrappedVisitActivity {
        this.verifyEntitiesAreFromTheSameVisit(activities);

        return {
            visit: this.visitEntityToDtoConverter.convert(visit),
            children: children.map(visitedChildEntity => this.childConverter.convert(visitedChildEntity)),
            activities: activities.map(group => this.basicDtoConverter.convert(group)),
            info: this.infoConverter.convert(info)
        }
    }

    private verifyEntitiesAreFromTheSameVisit(entities: Array<VisitActivityEntity>): void {
        if (isNilOrEmpty(entities)) {
            return;
        }
        const visitId = entities[0].visit.id;
        const areVisitIdsSame = entities.every(entity => entity.visit.id === visitId);
        if (!areVisitIdsSame) {
            throw new InternalServerErrorException('Activity objects are from different visits');
        }
    }

}
