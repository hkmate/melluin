import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitActivityInfoInput} from '@shared/hospital-visit-activity/hospital-visit-activity-info-input';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {ActivityInfoEntityToDtoConverter} from '@be/hospital-visit-activity-info/converter/activity-info-entity-to-dto.converter';
import {HospitalVisitActivityInfoDao} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.dao';

@Injectable()
export class HospitalVisitActivityInfoCrudService {

    constructor(private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly activityInfoDao: HospitalVisitActivityInfoDao,
                private readonly dtoConverter: ActivityInfoEntityToDtoConverter) {
    }

    public async addActivityInfo(visitId: string, activityInfo: HospitalVisitActivityInfoInput, requester: User): Promise<HospitalVisitActivityInfo> {
        const visit = await this.hospitalVisitDao.getOne(visitId);
        this.verifyVisitIsStarted(visit);
        const persisted = await this.activityInfoDao.getOneByVisitId(visitId);

        persisted.content = activityInfo.content ?? null;

        const entity = await this.activityInfoDao.save(persisted);
        return this.dtoConverter.convert(entity);
    }

    public async getActivityInfo(visitId: string, requester: User): Promise<HospitalVisitActivityInfo> {
        const entity = await this.activityInfoDao.getOneByVisitId(visitId);
        return this.dtoConverter.convert(entity);
    }

    private verifyVisitIsStarted(visit: HospitalVisitEntity): void {
        if (visit.status !== HospitalVisitStatus.STARTED) {
            throw new BadRequestException('Manage activity is only acceptable when the visit is in status: STARTED');
        }
    }

}
