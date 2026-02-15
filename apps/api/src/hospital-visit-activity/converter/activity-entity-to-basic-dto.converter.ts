import {Injectable} from '@nestjs/common';
import {Converter, HospitalVisitActivity, isNil} from '@melluin/common';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';

@Injectable()
export class ActivityEntityToBasicDtoConverter implements Converter<HospitalVisitActivityEntity, HospitalVisitActivity> {

    public convert(value: HospitalVisitActivityEntity): HospitalVisitActivity;
    public convert(value: undefined): undefined;
    public convert(value?: HospitalVisitActivityEntity): HospitalVisitActivity | undefined;
    public convert(value?: HospitalVisitActivityEntity): HospitalVisitActivity | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(entity: HospitalVisitActivityEntity): HospitalVisitActivity {
        return {
            id: entity.id,
            comment: entity.comment,
            activities: entity.activities,
            children: entity.children.map(c => c.id)
        }
    }

}
