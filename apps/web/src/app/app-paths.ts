import {PathProvider} from './path-resolve/path-resolve.service';
import {Injectable} from '@angular/core';

export const CREATE_MARKER = 'new';
export type CreateMarkerType = typeof CREATE_MARKER;

export const PATHS = {

    dashboard: {
        main: 'dashboard',
    },

    login: {
        main: 'login',
    },

    people: {
        main: 'people',
        detail: ':id',
        new: CREATE_MARKER
    },

    myProfile: {
        main: 'my-profile'
    },

    departments: {
        main: 'departments',
        detail: ':id',
        new: CREATE_MARKER
    },

    events: {
        main: 'events'
    },

    visit: {
        main: 'visits',
        detail: ':id',
        fillActivities: 'fill-activities'
    },

    sysadmin: {
        main: 'admin',
        roles: 'roles'
    },

    statistics: {
        main: 'statistics'
    },

    questionnaire: {
        main: 'questionnaire'
    }

} as const;

export interface PathDescriptor {
    main: string;

    [subKeys: string]: string;
}

@Injectable()
export class MelluinPathProvider extends PathProvider {

    public override isId(str: string): boolean {
        return str === ':id';
    }

    public override allPaths(): Array<Array<string>> {
        const result: Array<Array<string>> = [];
        for (const path of Object.values(PATHS)) {
            result.push(...this.convertPathDescriptorToArray(path));
        }
        return result;
    }

    private convertPathDescriptorToArray(descriptor: PathDescriptor): Array<Array<string>> {
        return [[descriptor.main]].concat(
            Object.keys(descriptor)
                .filter(key => key !== 'main')
                .map(key => descriptor[key])
                .map(path => path.split('/'))
                .map(pathParts => [descriptor.main].concat(pathParts))
        );
    }

}
