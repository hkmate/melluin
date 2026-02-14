import {Pipe, PipeTransform} from '@angular/core';
import {Child, ChildAge} from '@shared/child/child';
import {TranslateService} from '@ngx-translate/core';
import {getChildAge} from '@shared/child/child-age-calculator';

@Pipe({
    name: 'childAge',
    pure: true
})
export class ChildAgePipe implements PipeTransform {

    constructor(private readonly translate: TranslateService) {
    }

    public transform(child: Child, date: Date): string {
        const age: ChildAge = getChildAge(child, date);
        if (age.months === 0) {
            return this.translate.instant('ChildCard.AgeWithoutMonth', age);
        }
        return this.translate.instant('ChildCard.Age', age);
    }

}
