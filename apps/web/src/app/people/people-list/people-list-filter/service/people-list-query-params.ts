import {EnumTypeOf} from '@melluin/common';

export const PeopleListQueryParams = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    role: 'role',
    city: 'city',
    onlyActive: 'onlyActive'
} as const;

export type PeopleListQueryParam = EnumTypeOf<typeof PeopleListQueryParams>;
