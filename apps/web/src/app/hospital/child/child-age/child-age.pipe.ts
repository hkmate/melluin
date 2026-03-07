import {inject, Pipe, PipeTransform} from '@angular/core';
import {Child, ChildAge, getChildAge} from '@melluin/common';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
    name: 'childAge'
})
export class ChildAgePipe implements PipeTransform {

    private readonly translate = inject(TranslateService);

    public transform(child: Child, date: Date): string {
        const age: ChildAge = getChildAge(child, date);
        if (age.months === 0) {
            return this.translate.instant('ChildCard.AgeWithoutMonth', age);
        }
        return this.translate.instant('ChildCard.Age', age);
    }

}
