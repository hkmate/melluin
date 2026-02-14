import {Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitActivityInfoInput} from '@shared/hospital-visit-activity/hospital-visit-activity-info-input';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {ActivityInfoEntityToDtoConverter} from '@be/hospital-visit-activity-info/converter/activity-info-entity-to-dto.converter';
import {HospitalVisitActivityInfoDao} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.dao';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {UserCanWriteActivityInVisitValidator} from '@be/hospital-visit-activity/validator/user-can-write-activity-in-visit.validator';
import {VisitIsInStartedStatusValidator} from '@be/hospital-visit-activity/validator/visit-is-in-started-status.validator';
import {VisitActivityInfoUpdateValidator} from '@be/hospital-visit-activity-info/validator/visit-activity-info-validator';

@Injectable()
export class HospitalVisitActivityInfoCrudService {

    constructor(private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly activityInfoDao: HospitalVisitActivityInfoDao,
                private readonly dtoConverter: ActivityInfoEntityToDtoConverter) {
    }

    public async addActivityInfo(visitId: string, activityInfo: HospitalVisitActivityInfoInput, requester: User): Promise<HospitalVisitActivityInfo> {
        const visit = await this.hospitalVisitDao.getOne(visitId);

        await this.getValidatorForUpdate().validate({visit, requester});

        const persisted = await this.activityInfoDao.getOneByVisitId(visitId);

        persisted.content = activityInfo.content ?? null;

        const entity = await this.activityInfoDao.save(persisted);
        return this.dtoConverter.convert(entity);
    }

    public async getActivityInfo(visitId: string, requester: User): Promise<HospitalVisitActivityInfo> {
        const entity = await this.activityInfoDao.getOneByVisitId(visitId);
        return this.dtoConverter.convert(entity);
    }

    private getValidatorForUpdate(): VisitActivityInfoUpdateValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteActivityInVisitValidator(),
            new VisitIsInStartedStatusValidator(),
        );
    }


}
