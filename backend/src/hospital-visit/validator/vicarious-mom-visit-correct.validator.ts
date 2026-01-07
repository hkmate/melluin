import {BadRequestException} from '@nestjs/common';
import {AsyncValidator} from '@shared/validator/validator';
import {VisitValidationData} from '@be/hospital-visit/validator/visit-validator';


export class VicariousMomVisitCorrectValidator implements AsyncValidator<VisitValidationData> {

    public validate({item}: VisitValidationData): Promise<void> {
        const {vicariousMomVisit, participantIds} = item;
        if (vicariousMomVisit && participantIds.length !== 1) {
            throw new BadRequestException('VicariousMomVisit could be only when there is one participant');
        }
        return Promise.resolve();
    }

}
