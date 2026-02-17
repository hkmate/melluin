import {Injectable} from '@nestjs/common';
import {Converter, VisitActivityInfo, isNil} from '@melluin/common';
import {VisitActivityInfoEntity} from '@be/visit-activity-info/model/visit-activity-info.entity';


@Injectable()
export class ActivityInfoEntityToDtoConverter implements Converter<VisitActivityInfoEntity, VisitActivityInfo> {

    public convert(value: VisitActivityInfoEntity): VisitActivityInfo;
    public convert(value: undefined): undefined;
    public convert(value?: VisitActivityInfoEntity): VisitActivityInfo | undefined;
    public convert(value?: VisitActivityInfoEntity): VisitActivityInfo | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(entity: VisitActivityInfoEntity): VisitActivityInfo {
        return {
            content: entity.content ?? undefined,
        }
    }


}
