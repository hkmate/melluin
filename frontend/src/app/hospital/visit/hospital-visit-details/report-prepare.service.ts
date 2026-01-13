import {inject, Injectable} from '@angular/core';
import {VisitActivityService} from '../../visit-activity/visit-activity.service';
import {firstValueFrom} from 'rxjs';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import dayjs from 'dayjs'
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {getFullName, PersonIdentifier} from '@shared/person/person';
import _, {isNil, round} from 'lodash';
import {getMonthsSince} from '@shared/child/child-age-calculator';
import {AppConfig} from '@fe/app/config/app-config';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {TranslateService} from '@ngx-translate/core';
import {PATHS} from '@fe/app/app-paths';
import {Child} from '@shared/child/child';
import {isNotEmpty} from '@shared/util/util';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';


@Injectable()
export class ReportPrepareService {

    private readonly activityService = inject(VisitActivityService);
    private readonly currentUserService = inject(CredentialStoreService);
    private readonly translate = inject(TranslateService);

    public async draftCreator(visitIds: Array<string>): Promise<ReportPrepareCreator> {
        const currentUser = this.currentUserService.getUser();
        if (isNil(currentUser)) {
            throw new Error('Draft could be prepared with logged in user!');
        }
        const wrappedActivities = await this.getWrappedData(visitIds);
        const currentPerson = wrappedActivities[0].hospitalVisit.participants.find(p => p.id === currentUser.personId);
        const activityTypeToStr = (activityType: VisitActivityType): string => this.translate.instant('VisitActivityType.' + activityType);

        if (isNil(currentPerson)) {
            throw new Error('Draft could be prepared with user participated in visit!');
        }

        return new ReportPrepareCreator(wrappedActivities, activityTypeToStr, currentPerson);
    }

    private getWrappedData(ids: Array<string>): Promise<Array<WrappedHospitalVisitActivity>> {
        return Promise.all(ids.map(id => firstValueFrom(this.activityService.getActivities(id))));
    }

}

export class ReportPrepareCreator {

    private readonly MONTHS_PER_YEAR = 12;
    private readonly INDENT_SIZE = 4;

    constructor(private readonly wrappedActivities: Array<WrappedHospitalVisitActivity>,
                private readonly activityTypeToStr: (type: VisitActivityType) => string,
                private readonly currentPerson: PersonIdentifier) {
        wrappedActivities.sort((visit1, visit2) =>
            visit1.hospitalVisit.dateTimeFrom.localeCompare(visit2.hospitalVisit.dateTimeFrom));
    }

    public openReportDraft(): void {
        const title = this.createTitle();
        const body = this.createMessage();
        const link = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        open(link);
    }

    private createTitle(): string {
        const date = dayjs(this.wrappedActivities[0].hospitalVisit.dateTimeFrom).format('MM.DD.')
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
        const fullDate = dayjs(this.wrappedActivities[0].hospitalVisit.dateTimeFrom).format('YYYY.MM.DD.')
        const departmentNames = this.getEveryDepartmentNames();
        const participants = this.getEveryParticipant().map(getFullName);
        const participantsStr = participants.join(', ');
        return ''
            + `${fullDate} - ${departmentNames.join(', ')}\n`
            + `${participantsStr}\n`
            + `${this.getLinks()}\n`
    }

    private createChildrenList(): string {
        const children = this.getEveryChild();
        const childrenWithAge = children.map(child => `${child.name} (${this.createChildAgeStr(child.guessedBirth)})`)
        const childrenStr = childrenWithAge.join(', ');
        return `Gyerekek: ${childrenStr}\n`;
    }

    private createSendHint(): string {
        return `Ide küldd majd a levelet miután megírtad: ${AppConfig.get('reportMailAddress')}\n`
    }

    private createMessageHint(): string {
        const activities = this.createActivityHints();
        return 'Emlékeztetőül, a tevékenységek amiket felvettetek az alkalmazásba:\n'
            + `${activities}\n`;
    }

    private createActivityHints(): string {
        if (this.wrappedActivities.length === 1) {
            return this.wrappedActivities[0].activities.map(act =>
                this.mapActivityToString(act, this.wrappedActivities[0].children))
                .join('\n');
        }
        return this.wrappedActivities.map(w =>
            `${w.hospitalVisit.department.name}:\n${w.activities.map(act =>
                this.mapActivityToString(act, w.children)).join('\n')}`
        ).join('\n\n');
    }

    private mapActivityToString(activity: HospitalVisitActivity, children: Array<VisitedChild>): string {
        const activities = activity.activities.map(this.activityTypeToStr).join(', ');
        const childrenNames = this.getChildrenNameByIds(children, activity.children).join(', ');
        const comment = isNotEmpty(activity.comment ?? '') ? `\n${this.indent(2)}${activity.comment}` : '';
        return `${this.indent(1)}${activities}\n${this.indent(2)}${childrenNames}${comment}`
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

    private getChildrenNameByIds(children: Array<VisitedChild>, childrenId: Array<string>): Array<string> {
        return childrenId.map(childId => children.find(c => c.id === childId)!.child.name)
    }

    private indent(size: number): string {
        return ' '.repeat(size * this.INDENT_SIZE);
    }

    private getEveryDepartmentNames(): Array<string> {
        return this.wrappedActivities.map(w => w.hospitalVisit.department.name);
    }

    private getEveryParticipant(): Array<PersonIdentifier> {
        const summed = _.flatten(this.wrappedActivities.map(w => w.hospitalVisit.participants));
        const everyPerson = _.uniqBy(summed, person => person.id);
        return everyPerson.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
    }

    private getEveryChild(): Array<Child> {
        return _.flatten(this.wrappedActivities.map(w => w.children)).map(visitedChild => visitedChild.child);
    }

    private getLinks(): string {
        return this.wrappedActivities
            .map(w => `${window.location.origin}/${PATHS.hospitalVisit.main}/${w.hospitalVisit.id}`)
            .join('\n');
    }

}
