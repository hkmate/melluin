import {BadRequestException, Injectable} from '@nestjs/common';
import {
    VisitRewriteValidationData,
    VisitSaveValidator,
    VisitValidationData
} from '@be/visit/validator/visit-validator';
import {VisitDao} from '@be/visit/visit.dao';
import {ApiErrors, VisitCreate, VisitRewrite, isEmpty} from '@melluin/common';
import * as _ from 'lodash';

@Injectable()
export class ParticipantsIsInOneVisitAtSameTimeValidator implements VisitSaveValidator {

    constructor(private readonly visitDao: VisitDao) {
    }

    public async validate(data: VisitValidationData): Promise<void> {
        if ('entity' in data && this.isNoParticipantChange(data)) {
            return;
        }

        const visitCount = await this.getSameLikeVisitCount(data.item);
        if (visitCount === 0) {
            return;
        }
        throw new BadRequestException({
            message: 'Volunteers cannot participate more than one visit at same time.',
            code: ApiErrors.VOLUNTEER_COULD_PARTICIPANT_ONE_VISIT_AT_SAME_TIME
        });
    }

    private getSameLikeVisitCount(item: VisitRewrite | VisitCreate): Promise<number> {
        return this.visitDao.countForSameTimeAndParticipants({
            from: item.dateTimeFrom,
            to: item.dateTimeTo,
            participantsIds: item.participantIds,
            id: ('id' in item) ? item.id : undefined,
        });
    }

    private isNoParticipantChange({entity, item}: VisitRewriteValidationData): boolean {
        const entityParticipantIds = entity.participants.map(p => p.id);
        return isEmpty(_.xor(entityParticipantIds, item.participantIds));
    }

}
