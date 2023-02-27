export const hospitalVisitSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedMinutes'
];

export const hospitalVisitFilterableFields = [
    ...hospitalVisitSortableFields,
    'organizer.id',
    'organizer.name'

];
