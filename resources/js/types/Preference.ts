// USED IN MENU CREATE FORM
export type TMenuPreferences = Array<string>;

export interface IPreferenceTranslation {
    name: string;
}

export interface IPreferenceTranslations {
    [lang: string]: IPreferenceTranslation;
} 

export interface IPreferenceDataTranslations {
    preference_id: string;
    translations: IPreferenceTranslations;
}


export interface IPreference
{
    id: string;
    name: string;
    description: string;
    translations?: IPreferenceTranslations;
}

export interface IPreferenceResponseItem {
    item: IPreference;
}

export type TPreferences = Array<IPreference>; 

