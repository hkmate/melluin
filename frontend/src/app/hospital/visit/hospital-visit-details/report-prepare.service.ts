import {Injectable} from '@angular/core';
import {VisitActivityService} from '../../visit-activity/visit-activity.service';
import {firstValueFrom} from 'rxjs';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import dayjs from 'dayjs'
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {PersonIdentifier} from '@shared/person/person';
import {isNil, round} from 'lodash';
import {getMonthsSince} from '@shared/child/child-age-calculator';
import {AppConfig} from '@fe/app/config/app-config';
import {isNotEmpty} from 'class-validator';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class ReportPrepareService {

    constructor(private readonly activityServise: VisitActivityService,
        private readonly currentUserService: CredentialStoreService,
        private readonly translate: TranslateService
    ) {
    }

    public async draftCreater(visitId): Promise<ReportPrepareCreater> {
        const currentUser = this.currentUserService.getUser();
        if (isNil(currentUser)) {
            throw new Error('Draft could be prepared with logged in user!');
        }
        const wrappedActivities = await firstValueFrom(this.activityServise.getActivities(visitId));
        const currentPerson = wrappedActivities.hospitalVisit.participants.find(p => p.id === currentUser.personId);
        const activityTypeToStr = (activityType: VisitActivityType): string => this.translate.instant('VisitActivityType.' + activityType);

        if (isNil(currentPerson)) {
            throw new Error('Draft could be prepared with user participated in visit!');
        }

        return new ReportPrepareCreater(wrappedActivities, activityTypeToStr, currentPerson);
    }

}

export class ReportPrepareCreater {

    private readonly MONTHS_PER_YEAR = 12;
    private readonly INDENT_SIZE = 4;

    private readonly children: Array<VisitedChild>;
    private readonly hospitalVisit: HospitalVisit;
    private readonly activities: Array<HospitalVisitActivity>;

    constructor(wrappedActivities: WrappedHospitalVisitActivity,
        private readonly activityTypeToStr: (type: VisitActivityType) => string,
        private readonly currentPerson: PersonIdentifier) {
        this.children = wrappedActivities.children;
        this.hospitalVisit = wrappedActivities.hospitalVisit;
        this.activities = wrappedActivities.activities;
    }

    public openReportDraft(): void {
        const title = this.createTitle();
        const body = this.createMessage();
        const link = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        open(link);
    }

    private createTitle(): string {
        const date = dayjs(this.hospitalVisit.dateTimeFrom).format('MM.DD.')
        return `Beszámoló ${date}`;
    }

    private createMessage(): string {
        return ''
            .concat(this.createGreeting())
            .concat(this.createNewLine())
            .concat(this.createHeader())
            .concat(this.createNewLine())
            .concat(this.createChildrenList())
            .concat(this.createNewLine())
            .concat(this.createSendHint())
            .concat(this.createMessageHint())
            .concat(this.createNewLine())
            .concat(this.createFooter());
    }

    private createGreeting(): string {
        return 'Szia,\n'
    }

    private createNewLine(): string {
        return '\n'
    }

    private createHeader(): string {
        const fullDate = dayjs(this.hospitalVisit.dateTimeFrom).format('YYYY.MM.DD.')
        const participants = this.hospitalVisit.participants.map(participant => `${participant.lastName} ${participant.firstName}`);
        const participantsStr = participants.join(', ');
        return ''
            + `${fullDate} - ${this.hospitalVisit.department.name}\n`
            + `${participantsStr}\n`
            + `${window.location.href}\n`
    }

    private createChildrenList(): string {
        const children = this.children.map(child => child.child);
        const childrenWithAge = children.map(child => `${child.name} (${this.createChildAgeStr(child.guessedBirth)})`)
        const childrenStr = childrenWithAge.join(', ');
        return `Gyerekek: ${childrenStr}\n`;
    }


    private createSendHint(): string {
        return `Ide küldd majd a levelet miután megírtad: ${AppConfig.get('reportMailAddress')}\n`
    }

    private createMessageHint(): string {
        const activities = this.activities.map(act => this.mapActivitiyToString(act)).join('\n');
        return 'Emlékeztetőül, a tevékenységek amiket felvettetek az alkalmazásba:\n'
            + `${activities}\n`;
    }

    private mapActivitiyToString(activity: HospitalVisitActivity): string {
        const activities = activity.activities.map(this.activityTypeToStr).join(', ');
        const children = this.getChildrenNameByIds(activity.children).join(', ');
        const comment = isNotEmpty(activity.comment) ? `\n${this.indent(2)}${activity.comment}` : '';
        return `${this.indent(1)}${activities}\n${this.indent(2)}${children}${comment}`
    }

    private createFooter(): string {
        return `Üdv,\n${this.currentPerson.firstName}\n`;
    }

    private createChildAgeStr(guessedBirth: string): string {
        const months = getMonthsSince(guessedBirth);
        if (months < this.MONTHS_PER_YEAR) {
            return `${months} hó`;
        }
        return `${round(months / this.MONTHS_PER_YEAR)}`
    }

    private getChildrenNameByIds(childrenId: Array<string>): Array<string> {
        return childrenId.map(childId => this.children.find(c => c.id === childId)!.child.name)
    }

    private indent(size: number): string {
        return ' '.repeat(size * this.INDENT_SIZE);
    }

}
