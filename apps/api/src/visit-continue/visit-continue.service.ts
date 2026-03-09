import {Injectable} from '@nestjs/common';
import {
    AsyncValidatorChain,
    Visit,
    VisitCreate,
    VisitStatus,
    User, UUID
} from '@melluin/common';
import {VisitConnectionsService} from '@be/visit-connections/visit-connections.service';
import {VisitCrudService} from '@be/visit/visit.crud.service';
import dayjs from 'dayjs';
import {VisitDao} from '@be/visit/visit.dao';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitContinueValidator} from '@be/visit-continue/validator/visit-continue-validator';
import {DateTimeIsInOriginalVisitsTimeValidator} from '@be/visit-continue/validator/date-time-is-in-original-visits-time.validator';
import {VisitIsInStartedStatusValidator} from '@be/visit-continue/validator/visit-is-in-started-status.validator';
import {VisitSaveValidatorFactory} from '@be/visit/validator/visit-save-validator-factory';

@Injectable()
export class VisitContinueService {

    constructor(private readonly visitService: VisitCrudService,
                private readonly visitDao: VisitDao,
                private readonly validatorFactory: VisitSaveValidatorFactory,
                private readonly visitConnectionsService: VisitConnectionsService) {
    }

    public async createConnectedVisit(visitId: UUID, dateTimeFrom: string,
                                      departmentId: UUID, requester: User): Promise<Visit> {
        const originalVisit = await this.visitDao.getOne(visitId);
        const visitCreate = this.buildVisitCreateFromOriginal(originalVisit, dateTimeFrom, departmentId, requester);
        await this.createValidator()
            .validate({requester, originalVisit, item: visitCreate, sameTimeVisitForced: false});

        return await this.setUpNewVisit(originalVisit, visitCreate, requester);
    }

    private buildVisitCreateFromOriginal(visit: VisitEntity, dateTimeFrom: string,
                                         departmentId: UUID, requester: User): VisitCreate {
        return {
            departmentId,
            status: VisitStatus.STARTED,
            dateTimeFrom,
            dateTimeTo: visit.dateTimeTo.toISOString(),
            countedMinutes: dayjs(visit.dateTimeTo).diff(dateTimeFrom, 'minutes'),
            vicariousMomVisit: false,
            organizerId: requester.personId,
            participantIds: visit.participants.map(participant => participant.id)
        } satisfies VisitCreate;
    }

    private async setUpNewVisit(originalVisit: VisitEntity,
                                visitCreate: VisitCreate, requester: User): Promise<Visit> {
        await this.reWriteOriginalVisit(originalVisit, visitCreate.dateTimeFrom);
        const newVisit = await this.visitService.save(visitCreate, false, requester);
        await this.visitConnectionsService.addConnection(originalVisit.id, newVisit.id, requester);
        return newVisit;
    }

    private reWriteOriginalVisit(visit: VisitEntity, dateTimeFrom: string): Promise<VisitEntity> {
        visit.dateTimeTo = new Date(dateTimeFrom);
        visit.countedMinutes = dayjs(visit.dateTimeTo).diff(visit.dateTimeFrom, 'minutes');
        visit.status = VisitStatus.ACTIVITIES_FILLED_OUT;
        return this.visitDao.save(visit);
    }

    private createValidator(): VisitContinueValidator {
        return AsyncValidatorChain.of(
            new VisitIsInStartedStatusValidator(),
            new DateTimeIsInOriginalVisitsTimeValidator(),
            ...this.validatorFactory.getValidatorsForContinue()
        );
    }

}
