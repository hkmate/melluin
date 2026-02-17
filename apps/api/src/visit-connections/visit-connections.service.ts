import {Injectable} from '@nestjs/common';
import {AsyncValidatorChain, Visit, User} from '@melluin/common';
import {VisitConnectionsDao} from '@be/visit-connections/visit-connections.dao';
import {VisitEntityToDtoConverter} from '@be/visit/converer/visit-entity-to-dto.converter';
import {VisitDao} from '@be/visit/visit.dao';
import {randomUUID} from 'crypto';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitConnectionValidator} from '@be/visit-connections/validator/visit-connection-validator';
import {BothVisitInSameGroupValidator} from '@be/visit-connections/validator/both-visit-in-same-group.validator';
import {ConnectionCandidateHasNoConnectionYetValidator} from '@be/visit-connections/validator/connection-candidate-has-no-connection-yet.validator';
import {VisitHaveSameDateValidator} from '@be/visit-connections/validator/visit-have-same-date.validator';
import {VisitsHaveCommonParticipantsValidator} from '@be/visit-connections/validator/visits-have-common-participants.validator';
import {VisitsAreNotSameValidator} from '@be/visit-connections/validator/visits-are-not-same.validator';
import {ConnectedVisitIsNotVicariousMomVisitValidator} from '@be/visit-connections/validator/connected-visit-is-not-vicarious-mom-visit.validator';

@Injectable()
export class VisitConnectionsService {

    constructor(private readonly visitDao: VisitDao,
                private readonly visitConnectionsDao: VisitConnectionsDao,
                private readonly visitConverter: VisitEntityToDtoConverter,) {
    }

    public async addConnection(visitId: string, connectId: string, requester: User): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        const connectVisit = await this.visitDao.getOne(connectId);

        await this.createValidatorsForAdd().validate({visit, connectCandidate: connectVisit, requester});

        const connectionGroupId = await this.getConnectionGroupIdFromVisits(visit, connectVisit);
        visit.connectionGroupId = connectionGroupId;
        connectVisit.connectionGroupId = connectionGroupId;
        await this.visitDao.saveMany(visit, connectVisit);
    }

    public async getConnections(visitId: string, requester: User): Promise<Array<Visit>> {
        const connectedVisits = await this.visitConnectionsDao.findAllConnections(visitId);
        return connectedVisits.map(entity => this.visitConverter.convert(entity));
    }

    public async deleteConnection(visitId: string, connectedId: string, requester: User): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        const connectedVisit = await this.visitDao.getOne(connectedId);

        await this.createValidatorsForDelete().validate({visit, connectCandidate: connectedVisit, requester});

        const groupSize = await this.visitConnectionsDao.getConnectionGroupSize(visit.connectionGroupId);
        connectedVisit.connectionGroupId = connectedVisit.id;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (groupSize === 2) {
            visit.connectionGroupId = visit.id;
        }
        await this.visitDao.saveMany(connectedVisit, visit);
    }

    private async getConnectionGroupIdFromVisits(visit: VisitEntity, visit2: VisitEntity): Promise<string> {
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
        if (await this.visitConnectionsDao.isConnectionGroupIdUsed(newId)) {
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
