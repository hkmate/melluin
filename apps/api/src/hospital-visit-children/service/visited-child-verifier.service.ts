import * as _ from 'lodash';
import {isNotEmpty} from '@shared/util/util';
import {BadRequestException, Injectable} from '@nestjs/common';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';

@Injectable()
export class VisitedChildVerifierService {

    constructor(private readonly visitedChildrenDao: VisitedChildrenDao) {
    }

    public async verifyEveryChildIdExists(visitedChildIds: Array<string>): Promise<void> {
        const persistedChildIds: Array<string> = await this.visitedChildrenDao.findIdByIds(visitedChildIds);
        this.verifyFoundChildForEveryId(persistedChildIds, visitedChildIds);
    }

    private verifyFoundChildForEveryId(entityIds: Array<string>, ids: Array<string>): void {
        const diff = _.difference(ids, entityIds);
        if (isNotEmpty(diff)) {
            throw new BadRequestException(`No child found with these ids: ${diff.join(',')}`);
        }
    }

}
