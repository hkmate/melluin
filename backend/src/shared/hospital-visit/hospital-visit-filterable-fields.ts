export const hospitalVisitSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedMinutes', 'department.name'
];

export const hospitalVisitFilterableFields = [
    ...hospitalVisitSortableFields,
    'organizer.id',
    'organizer.name',
    'department.id',
    'participants.id',
    'status'
];
