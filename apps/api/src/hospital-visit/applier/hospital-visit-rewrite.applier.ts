import {BadRequestException} from '@nestjs/common';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {PersonDao} from '@be/person/person.dao';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {areArrayHasSameItems} from '@be/util/util';


export class HospitalVisitRewriteApplier {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao,
                private readonly rewrite: HospitalVisitRewrite,
                private readonly persisted: HospitalVisitEntity) {
    }

    public async applyChanges(): Promise<HospitalVisitEntity> {
        this.verifyVisitIdIsCorrect();
        this.rewirePrimitiveFields();
        await this.rewriteDepartment();
        await this.rewriteParticipants();

        return this.persisted;
    }

    private verifyVisitIdIsCorrect(): void {
        if (this.rewrite.id !== this.persisted.id) {
            throw new BadRequestException('Id from url is not match the one from the body.');
        }
    }

    private rewirePrimitiveFields(): void {
        this.persisted.status = this.rewrite.status;
        this.persisted.countedMinutes = this.rewrite.countedMinutes;
        this.persisted.dateTimeFrom = new Date(this.rewrite.dateTimeFrom);
        this.persisted.dateTimeTo = new Date(this.rewrite.dateTimeTo);
        this.persisted.visibility = this.rewrite.visibility;
        this.persisted.vicariousMomVisit = this.rewrite.vicariousMomVisit;
    }

    private async rewriteDepartment(): Promise<void> {
        if (this.rewrite.departmentId === this.persisted.department.id) {
            return;
        }
        const newDepartment = await this.departmentDao.getOne(this.rewrite.departmentId);
        this.persisted.department = newDepartment;
    }

    private async rewriteParticipants(): Promise<void> {
        if (!this.areParticipantsChanged()) {
            return;
        }
        const newParticipants = await this.personDao.findByIds(this.rewrite.participantIds);
        this.persisted.participants = newParticipants;
    }

    private areParticipantsChanged(): boolean {
        const persistedPeopleIds = this.persisted.participants.map(p => p.id);
        const rewriteIds = this.rewrite.participantIds;

        return !areArrayHasSameItems(rewriteIds, persistedPeopleIds);
    }

}
