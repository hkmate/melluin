export interface PersonPreferences {

    canVolunteerSeeMyPhone?: boolean;
    canVolunteerSeeMyEmail?: boolean;

}

export function createDefaultPersonPreferences(): PersonPreferences {
    return {
        canVolunteerSeeMyEmail: false,
        canVolunteerSeeMyPhone: false
    }
}
