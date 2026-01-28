export const hospitalVisitSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedMinutes', 'department.name',
    'participants.firstName', 'participants.lastName',
];

export const hospitalVisitFilterableFields = [
    'dateTimeFrom',
    'dateTimeTo',
    'organizer.id',
    'organizer.name',
    'department.id',
    'participants.id',
    'status'
];
