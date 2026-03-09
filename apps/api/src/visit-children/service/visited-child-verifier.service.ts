import * as _ from 'lodash';
import {isNotEmpty, UUID} from '@melluin/common';
import {BadRequestException, Injectable} from '@nestjs/common';
import {VisitedChildrenDao} from '@be/visit-children/persistence/visited-children.dao';

@Injectable()
export class VisitedChildVerifierService {

    constructor(private readonly visitedChildrenDao: VisitedChildrenDao) {
    }

    public async verifyEveryChildIdExists(visitedChildIds: Array<UUID>): Promise<void> {
        const persistedChildIds: Array<UUID> = await this.visitedChildrenDao.findIdByIds(visitedChildIds);
        this.verifyFoundChildForEveryId(persistedChildIds, visitedChildIds);
    }

    private verifyFoundChildForEveryId(entityIds: Array<UUID>, ids: Array<UUID>): void {
        const diff = _.difference(ids, entityIds);
        if (isNotEmpty(diff)) {
            throw new BadRequestException(`No child found with these ids: ${diff.join(',')}`);
        }
    }

}
