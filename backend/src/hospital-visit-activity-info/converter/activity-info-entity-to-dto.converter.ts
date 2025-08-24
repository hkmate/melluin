import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {HospitalVisitActivityInfoEntity} from '@be/hospital-visit-activity-info/model/hospital-visit-activity-info.entity';


@Injectable()
export class ActivityInfoEntityToDtoConverter implements Converter<HospitalVisitActivityInfoEntity, HospitalVisitActivityInfo> {

    public convert(value: HospitalVisitActivityInfoEntity): HospitalVisitActivityInfo;
    public convert(value: undefined): undefined;
    public convert(value?: HospitalVisitActivityInfoEntity): HospitalVisitActivityInfo | undefined;
    public convert(value?: HospitalVisitActivityInfoEntity): HospitalVisitActivityInfo | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(entity: HospitalVisitActivityInfoEntity): HospitalVisitActivityInfo {
        return {
            content: entity.content ?? undefined,
        }
    }


}
