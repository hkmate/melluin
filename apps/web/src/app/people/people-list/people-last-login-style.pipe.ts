import {Pipe, PipeTransform} from '@angular/core';
import {BriefUser, isNil, Person} from '@melluin/common';
import dayjs from 'dayjs';

@Pipe({name: 'lastLoginStyle'})
export class PeopleLastLoginStylePipe implements PipeTransform {

    public transform(value: Person): Record<string, boolean> {
        const user = value.user;
        if (isNil(user)) {
            return {'no-data': true}
        }
        return {
            'no-data': isNil(user.lastLogin),
            'last-login-moderate-warning': this.isLastLoginBeforeOneMonth(user),
            'last-login-full-warning': this.isLastLoginBeforeThreeMonths(user)
        };
    }

    private isLastLoginBeforeOneMonth(user: BriefUser): boolean {
        if (!user.isActive || isNil(user.lastLogin)) {
            return false
        }
        return dayjs(user.lastLogin).isBefore(dayjs().subtract(1, 'month'));
    }

    private isLastLoginBeforeThreeMonths(user: BriefUser): boolean {
        if (!user.isActive || isNil(user.lastLogin)) {
            return false
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return dayjs(user.lastLogin).isBefore(dayjs().subtract(3, 'month'));
    }

}
