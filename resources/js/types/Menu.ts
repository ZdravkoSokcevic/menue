import { AxiosResponse } from "axios";
import { TComponentProps } from "./TComponentProps";
import { TIngridients } from "./Ingridient";
import { TPreferences } from "./Preference";
import { TExtras } from "./Extra";
import { TPrices } from "./Prices";

export interface IMenuTranslation {
    name: string;
    description: string;
}

export interface IMenuTranslations {
    [lang: string]: IMenuTranslation;
} 


interface ITranslationsData {
    id: string, translations: IMenuTranslations
};

export interface TMenu extends TComponentProps{
    name: string;
    description: string;
    picture?: File | String | null;
    quantity: string;
    company_id?: string;
    category_id: string;
    prep_time: number | string;
    ingridients?: TIngridients;
    preferences: TPreferences;
    extras?: TExtras;
    portions?: TPrices;
    // Used as key in EditMenu submit
    prices?: TPrices;
    translations?: IMenuTranslations;
}

export interface MenuCreateResponseItem {
    item: TMenu
}

export interface ITranslationResponseItem {
    
}

export interface ICreateResponse extends AxiosResponse<MenuCreateResponseItem> {}

