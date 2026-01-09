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
    canModifyAnyVisit = 'canModifyAnyVisit',
    canForceSameTimeVisitWrite = 'canForceSameTimeVisitWrite',

    // Hospital visit/ Activity related
    canWriteChild = 'canWriteChild',
    canReadChild = 'canReadChild',
    canCreateActivity = 'canCreateActivity',
    canReadActivity = 'canReadActivity',


    // Administration related
    canReadStatistics = 'canReadStatistics',

    // Sysadmin related
    canManagePermissions = 'canManagePermissions',


}
