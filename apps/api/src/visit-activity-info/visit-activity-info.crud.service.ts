import {Injectable} from '@nestjs/common';
import {AsyncValidatorChain, VisitActivityInfo, VisitActivityInfoInput, User} from '@melluin/common';
import {VisitDao} from '@be/visit/visit.dao';
import {ActivityInfoEntityToDtoConverter} from '@be/visit-activity-info/converter/activity-info-entity-to-dto.converter';
import {VisitActivityInfoDao} from '@be/visit-activity-info/visit-activity-info.dao';
import {UserCanWriteActivityInVisitValidator} from '@be/visit-activity/validator/user-can-write-activity-in-visit.validator';
import {VisitIsInStartedStatusValidator} from '@be/visit-activity/validator/visit-is-in-started-status.validator';
import {VisitActivityInfoUpdateValidator} from '@be/visit-activity-info/validator/visit-activity-info-validator';

@Injectable()
export class VisitActivityInfoCrudService {

    constructor(private readonly visitDao: VisitDao,
                private readonly activityInfoDao: VisitActivityInfoDao,
                private readonly dtoConverter: ActivityInfoEntityToDtoConverter) {
    }

    public async addActivityInfo(visitId: string, activityInfo: VisitActivityInfoInput, requester: User): Promise<VisitActivityInfo> {
        const visit = await this.visitDao.getOne(visitId);

        await this.getValidatorForUpdate().validate({visit, requester});

        const persisted = await this.activityInfoDao.getOneByVisitId(visitId);

        persisted.content = activityInfo.content ?? null;

        const entity = await this.activityInfoDao.save(persisted);
        return this.dtoConverter.convert(entity);
    }

    public async getActivityInfo(visitId: string, requester: User): Promise<VisitActivityInfo> {
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
