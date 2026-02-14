import {VisitSaveValidator, VisitValidationData} from '@be/hospital-visit/validator/visit-validator';
import {DepartmentDao} from '@be/department/department.dao';
import {BadRequestException, Injectable} from '@nestjs/common';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {PersonDao} from '@be/person/person.dao';
import {PersonEntity} from '@be/person/model/person.entity';
import {OperationCity} from '@shared/person/operation-city';
import {ApiError} from '@shared/api-util/api-error';

@Injectable()
export class ParticipantsAreWorkInCityAsDepartmentValidator implements VisitSaveValidator {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao) {
    }

    public async validate(data: VisitValidationData): Promise<void> {
        const department = await this.getDepartment(data);
        const participants =  await this.personDao.findByIds(data.item.participantIds);
        this.verifyParticipantsAvailableInCity(participants, department.city);
    }

    private getDepartment(data: VisitValidationData): Promise<DepartmentEntity> {
        if ('entity' in data) {
            if (data.entity.department.id === data.item.departmentId) {
                return Promise.resolve(data.entity.department);
            }
        }
        return this.departmentDao.getOne(data.item.departmentId);
    }

    private verifyParticipantsAvailableInCity(participants: Array<PersonEntity>, city: OperationCity): void | never {
        for (const participant of participants) {
            if (!participant.cities.includes(city)) {
                throw new BadRequestException({
                    message: `Department is in city where person (${participant.lastName} ${participant.firstName}) is not available`,
                    code: ApiError.DEPARTMENT_IS_IN_OTHER_CITY_THAN_PARTICIPANT
                });
            }
        }
    }

}
