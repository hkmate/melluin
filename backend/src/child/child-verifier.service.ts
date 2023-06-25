import * as _ from 'lodash';
import {isNotEmpty} from '@shared/util/util';
import {BadRequestException, Injectable} from '@nestjs/common';
import {ChildDao} from '@be/child/child.dao';

@Injectable()
export class ChildVerifierService {

    constructor(private readonly childDao: ChildDao) {
    }

    public async verifyEveryChildIdExists(childIds: Array<string>): Promise<void> {
        const persistedChildIds: Array<string> = await this.childDao.findIdByIds(childIds);
        this.verifyFoundChildForEveryId(persistedChildIds, childIds);
    }

    private verifyFoundChildForEveryId(entityIds: Array<string>, ids: Array<string>): void {
        const diff = _.difference(ids, entityIds);
        if (isNotEmpty(diff)) {
            throw new BadRequestException(`No child found with these ids: ${diff.join(',')}`);
        }
    }

}
