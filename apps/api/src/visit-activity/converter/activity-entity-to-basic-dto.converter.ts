import {Injectable} from '@nestjs/common';
import {Converter, VisitActivity, isNil} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';

@Injectable()
export class ActivityEntityToBasicDtoConverter implements Converter<VisitActivityEntity, VisitActivity> {

    public convert(value: VisitActivityEntity): VisitActivity;
    public convert(value: undefined): undefined;
    public convert(value?: VisitActivityEntity): VisitActivity | undefined;
    public convert(value?: VisitActivityEntity): VisitActivity | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(entity: VisitActivityEntity): VisitActivity {
        return {
            id: entity.id,
            comment: entity.comment,
            activities: entity.activities,
            children: entity.children.map(c => c.id)
        }
    }

}
