export const personSortableFields = [
    'firstName', 'lastName', 'phone', 'email'
];

export const personFilterableFields = [
    ...personSortableFields, 'id', 'user.isActive', 'user.roleTypes', 'user.roleNames'
];
