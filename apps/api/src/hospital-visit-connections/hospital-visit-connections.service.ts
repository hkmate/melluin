import {Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitConnectionsDao} from '@be/hospital-visit-connections/hospital-visit-connections.dao';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {randomUUID} from 'crypto';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {VisitConnectionValidator} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {BothVisitInSameGroupValidator} from '@be/hospital-visit-connections/validator/both-visit-in-same-group.validator';
import {ConnectionCandidateHasNoConnectionYetValidator} from '@be/hospital-visit-connections/validator/connection-candidate-has-no-connection-yet.validator';
import {VisitHaveSameDateValidator} from '@be/hospital-visit-connections/validator/visit-have-same-date.validator';
import {VisitsHaveCommonParticipantsValidator} from '@be/hospital-visit-connections/validator/visits-have-common-participants.validator';
import {VisitsAreNotSameValidator} from '@be/hospital-visit-connections/validator/visits-are-not-same.validator';
import {ConnectedVisitIsNotVicariousMomVisitValidator} from '@be/hospital-visit-connections/validator/connected-visit-is-not-vicarious-mom-visit.validator';

@Injectable()
export class HospitalVisitConnectionsService {

    constructor(private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly hospitalVisitConnectionsDao: HospitalVisitConnectionsDao,
                private readonly visitConverter: HospitalVisitEntityToDtoConverter,) {
    }

    public async addConnection(visitId: string, connectId: string, requester: User): Promise<void> {
        const visit = await this.hospitalVisitDao.getOne(visitId);
        const connectVisit = await this.hospitalVisitDao.getOne(connectId);

        await this.createValidatorsForAdd().validate({visit, connectCandidate: connectVisit, requester});

        const connectionGroupId = await this.getConnectionGroupIdFromVisits(visit, connectVisit);
        visit.connectionGroupId = connectionGroupId;
        connectVisit.connectionGroupId = connectionGroupId;
        await this.hospitalVisitDao.saveMany(visit, connectVisit);
    }

    public async getConnections(visitId: string, requester: User): Promise<Array<HospitalVisit>> {
        const connectedVisits = await this.hospitalVisitConnectionsDao.findAllConnections(visitId);
        return connectedVisits.map(entity => this.visitConverter.convert(entity));
    }

    public async deleteConnection(visitId: string, connectedId: string, requester: User): Promise<void> {
        const visit = await this.hospitalVisitDao.getOne(visitId);
        const connectedVisit = await this.hospitalVisitDao.getOne(connectedId);

        await this.createValidatorsForDelete().validate({visit, connectCandidate: connectedVisit, requester});

        const groupSize = await this.hospitalVisitConnectionsDao.getConnectionGroupSize(visit.connectionGroupId);
        connectedVisit.connectionGroupId = connectedVisit.id;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (groupSize === 2) {
            visit.connectionGroupId = visit.id;
        }
        await this.hospitalVisitDao.saveMany(connectedVisit, visit);
    }

    private async getConnectionGroupIdFromVisits(visit: HospitalVisitEntity, visit2: HospitalVisitEntity): Promise<string> {
        if (visit.id !== visit.connectionGroupId) {
            return visit.connectionGroupId;
        }
        if (visit2.id !== visit2.connectionGroupId) {
            return visit2.connectionGroupId;
        }
        return await this.provideNewConnectionGroupId();
    }

    private async provideNewConnectionGroupId(): Promise<string> {
        const newId = randomUUID();
        if (await this.hospitalVisitConnectionsDao.isConnectionGroupIdUsed(newId)) {
            return await this.provideNewConnectionGroupId();
        }
        return newId;
    }

    private createValidatorsForAdd(): VisitConnectionValidator {
        return AsyncValidatorChain.of(
            new VisitsAreNotSameValidator(),
            new ConnectedVisitIsNotVicariousMomVisitValidator(),
            new ConnectionCandidateHasNoConnectionYetValidator(),
            new VisitHaveSameDateValidator(),
            new VisitsHaveCommonParticipantsValidator()
        );
    }

    private createValidatorsForDelete(): VisitConnectionValidator {
        return AsyncValidatorChain.of(
            new BothVisitInSameGroupValidator()
        );
    }

}
