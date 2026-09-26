export enum MenuItemAppearanceGridType {
    Single = "single",
    Double = "double"
}

export enum MenuItemAppearanceType {
    Clean = "clean",
    Compact = "compact"
}

export interface TCompanySettings {
    theme?: string;
    actionType?: ''; // modal or page
    menuItemsAppearanceGridType? : MenuItemAppearanceGridType; 
    menuItemsAppearance?: MenuItemAppearanceType;
}

export interface ICompanySettingsAxiosResponseType {
    settings? : TCompanySettings | Array<TCompanySettings>;
}

export interface ICompanySettingsAPIResponseType
{
    success: boolean;
    settings? : Array<TCompanySettings> | TCompanySettings;
    reason?: string;
}