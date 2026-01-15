import {Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitConnectionsService} from '@be/hospital-visit-connections/hospital-visit-connections.service';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import dayjs from 'dayjs';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {EventVisibility} from '@shared/event/event-visibility';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {VisitContinueValidator} from '@be/hospital-visit-continue/validator/visit-continue-validator';
import {DateTimeIsInOriginalVisitsTimeValidator} from '@be/hospital-visit-continue/validator/date-time-is-in-original-visits-time.validator';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {VisitIsInStartedStatusValidator} from '@be/hospital-visit-continue/validator/visit-is-in-started-status.validator';
import {VisitSaveValidatorFactory} from '@be/hospital-visit/validator/visit-save-validator-factory';

/* eslint-disable max-params-no-constructor/max-params-no-constructor */


@Injectable()
export class HospitalVisitContinueService {

    constructor(private readonly hospitalVisitService: HospitalVisitCrudService,
                private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly validatorFactory: VisitSaveValidatorFactory,
                private readonly hospitalVisitConnectionsService: HospitalVisitConnectionsService) {
    }

    public async createConnectedVisit(visitId: string, dateTimeFrom: string,
                                      departmentId: string, requester: User): Promise<HospitalVisit> {
        const originalVisit = await this.hospitalVisitDao.getOne(visitId);
        const visitCreate = this.buildVisitCreateFromOriginal(originalVisit, dateTimeFrom, departmentId, requester);
        await this.createValidator()
            .validate({requester, originalVisit, item: visitCreate, sameTimeVisitForced: false});

        return await this.setUpNewVisit(originalVisit, visitCreate, requester);
    }

    private buildVisitCreateFromOriginal(visit: HospitalVisitEntity, dateTimeFrom: string,
                                         departmentId: string, requester: User): HospitalVisitCreate {
        return {
            departmentId,
            status: HospitalVisitStatus.STARTED,
            dateTimeFrom,
            dateTimeTo: visit.dateTimeTo.toISOString(),
            countedMinutes: dayjs(visit.dateTimeTo).diff(dateTimeFrom, 'minutes'),
            vicariousMomVisit: false,
            organizerId: requester.personId,
            participantIds: visit.participants.map(participant => participant.id),
            visibility: EventVisibility.PUBLIC
        } satisfies HospitalVisitCreate;
    }

    private async setUpNewVisit(originalVisit: HospitalVisitEntity,
                                visitCreate: HospitalVisitCreate, requester: User): Promise<HospitalVisit> {
        await this.reWriteOriginalVisit(originalVisit, visitCreate.dateTimeFrom);
        const newVisit = await this.hospitalVisitService.save(visitCreate, false, requester);
        await this.hospitalVisitConnectionsService.addConnection(originalVisit.id, newVisit.id, requester);
        return newVisit;
    }

    private reWriteOriginalVisit(visit: HospitalVisitEntity, dateTimeFrom: string): Promise<HospitalVisitEntity> {
        visit.dateTimeTo = new Date(dateTimeFrom);
        visit.countedMinutes = dayjs(visit.dateTimeTo).diff(visit.dateTimeFrom, 'minutes');
        visit.status = HospitalVisitStatus.ACTIVITIES_FILLED_OUT;
        return this.hospitalVisitDao.save(visit);
    }

    private createValidator(): VisitContinueValidator {
        return AsyncValidatorChain.of(
            new VisitIsInStartedStatusValidator(),
            new DateTimeIsInOriginalVisitsTimeValidator(),
            ...this.validatorFactory.getValidatorsForContinue()
        );
    }

}
