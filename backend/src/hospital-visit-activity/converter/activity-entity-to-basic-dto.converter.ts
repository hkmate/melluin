import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {ActivityChildInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';

@Injectable()
export class ActivityEntityToBasicDtoConverter implements Converter<Array<HospitalVisitActivityEntity>, HospitalVisitActivity> {

    public convert(value: Array<HospitalVisitActivityEntity>): HospitalVisitActivity;
    public convert(value: undefined): undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): HospitalVisitActivity | undefined;
    public convert(value?: Array<HospitalVisitActivityEntity>): HospitalVisitActivity | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(entities: Array<HospitalVisitActivityEntity>): HospitalVisitActivity {
        this.verifyEntitiesAreFromTheSameGroup(entities);
        return {
            comment: this.getDistinctComments(entities).join(','),
            activities: this.getDistinctTypes(entities),
            children: this.getDistinctChild(entities)
        }
    }

    private verifyEntitiesAreFromTheSameGroup(entities: Array<HospitalVisitActivityEntity>): void {
        if (isNilOrEmpty(entities)) {
            return;
        }
        const groupId = entities[0].groupId;
        const areGroupIdsSame = entities.every(entity => entity.groupId === groupId);
        if (!areGroupIdsSame) {
            throw new InternalServerErrorException('Activity objects has different groupIds');
        }
    }

    private getDistinctComments(entities: Array<HospitalVisitActivityEntity>): Array<string> {
        return Array.from(new Set(entities.map(e => e.comment)))
            .filter(c => !(isNilOrEmpty(c)));
    }

    private getDistinctTypes(entities: Array<HospitalVisitActivityEntity>): Array<VisitActivityType> {
        return Array.from(new Set(entities.map(e => e.type)));
    }

    private getDistinctChild(entities: Array<HospitalVisitActivityEntity>): Array<ActivityChildInfo> {
        const childrenInfo = entities
            .map(entity => ({childId: entity.childId, isParentThere: entity.isParentThere}))
            .reduce<Record<string, ActivityChildInfo>>((result, info) => {
                result[info.childId] = info;
                return result;
            }, {});
        return Object.values(childrenInfo);
    }

}
