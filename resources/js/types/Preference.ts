// USED IN MENU CREATE FORM
export type TMenuPreferences = Array<string>;

export interface IPreference
{
    id: string;
    name: string;
    description: string;
}

export type TPreferences = Array<IPreference>; 

