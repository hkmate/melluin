import {BadRequestException, Injectable} from '@nestjs/common';
import {AsyncValidator} from '@shared/validator/validator';
import {VisitValidationData} from '@be/hospital-visit/validator/visit-validator';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {ApiError} from '@shared/api-util/api-error';

@Injectable()
export class ParticipantsIsInOneVisitAtSameTimeValidator implements AsyncValidator<VisitValidationData> {

    constructor(private readonly visitDao: HospitalVisitDao) {
    }

    public async validate({item}: VisitValidationData): Promise<void> {
        const visitCount = await this.getSameLikeVisitCount(item)

        if (visitCount === 0) {
            return;
        }
        throw new BadRequestException({
            message: 'Volunteers cannot participate more than one visit at same time.',
            code: ApiError.VOLUNTEER_COULD_PARTICIPANT_ONE_VISIT_AT_SAME_TIME
        });
    }

    private getSameLikeVisitCount(item: HospitalVisitRewrite | HospitalVisitCreate): Promise<number> {
        return this.visitDao.countForSameTimeAndParticipants({
            from: item.dateTimeFrom,
            to: item.dateTimeTo,
            participantsIds: item.participantIds,
            id: ('id' in item) ? item.id : undefined,
        });
    }

}
