import {Pipe, PipeTransform} from '@angular/core';
import {Child, ChildAge, getChildAge} from '@melluin/common';
import {t} from '@fe/app/util/translate/translate';

@Pipe({name: 'childAge'})
export class ChildAgePipe implements PipeTransform {

    public transform(child: Child, date: Date): string {
        const age: ChildAge = getChildAge(child, date);
        if (age.months === 0) {
            return t('ChildCard.AgeWithoutMonth', age);
        }
        return t('ChildCard.Age', age);
    }

}
