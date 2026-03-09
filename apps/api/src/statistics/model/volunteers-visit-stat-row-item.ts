import {UUID} from '@melluin/common';

export interface VolunteersVisitStatRowItem {
    person_id: UUID;
    person_name: string;
    visit_count: number;
    visit_minutes: number;
}
