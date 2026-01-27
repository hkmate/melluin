export enum Permission {

    // Department related
    canWriteDepartment = 'canWriteDepartment',
    canReadDepartment = 'canReadDepartment',
    canSearchDepartment = 'canSearchDepartment',
    canWriteDepBox = 'canWriteDepBox',
    canReadDepBox = 'canReadDepBox',

    // Person/User related
    canReadPerson = 'canReadPerson',
    canSearchPerson = 'canSearchPerson',
    canReadSensitivePersonData = 'canReadSensitivePersonData',
    canReadPersonCreateData = 'canReadPersonCreateData',
    canReadUserCreateData = 'canReadUserCreateData',
    canReadUserLastLoginData = 'canReadUserLastLoginData',

    canCreatePerson = 'canCreatePerson',
    canCreateUser = 'canCreateUser',

    canWriteVisitor = 'canWriteVisitor',
    canWriteCoordinator = 'canWriteCoordinator',
    canWriteAdmin = 'canWriteAdmin',
    canWriteSysAdmin = 'canWriteSysAdmin',
    canWriteSelf = 'canWriteSelf',
    canModifyPersonCity = 'canModifyPersonCity',

    // Hospital visit related
    canCreateVisit = 'canCreateVisit', // Create only those where he/she is participant
    canReadVisit = 'canReadVisit',
    canModifyVisit = 'canModifyVisit', // Write only those where he/she is participant
    canCreateAnyVisit = 'canCreateAnyVisit',
    canModifyAnyVisit = 'canModifyAnyVisit', // Write any visit but can make logical changes (for coordinator)
    canModifyAnyVisitUnrestricted = 'canModifyAnyVisitUnrestricted', // Write anything in any visit (for sysadmin)
    canForceSameTimeVisitWrite = 'canForceSameTimeVisitWrite',
    canReadVisitConnections = 'canReadVisitConnections',
    canWriteVisitConnections = 'canWriteVisitConnections',

    // Hospital visit / Activity related
    canWriteChild = 'canWriteChild',
    canWriteChildAtAnyVisit = 'canWriteChildAtAnyVisit',
    canReadChild = 'canReadChild',
    canCreateActivity = 'canCreateActivity',
    canWriteActivityAtAnyVisit = 'canCreateActivityAtAnyVisit',
    canReadActivity = 'canReadActivity',

    // Administration related
    canReadStatistics = 'canReadStatistics',

    // Sysadmin related
    canManagePermissions = 'canManagePermissions',

}
