export const hospitalVisitSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedHours'
];

export const hospitalVisitFilterableFields = [
    ...hospitalVisitSortableFields,
    'organizer.id',
    'organizer.name'

];
