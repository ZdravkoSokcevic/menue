import { TAllergens } from "./Allergen";

export interface IIngridientTranslation {
    name: string;
}

export interface IIngridientTranslations {
    [lang: string]: IIngridientTranslation;
} 

export interface IIngridientDataTranslations {
    ingridient_id: string;
    translations: IIngridientTranslations;
}

export type TMenuIngridients = Array<string>;

export interface IIngridient
{
    id: string;
    name: string;
    allergens?: TAllergens;
    is_vegan: boolean;
    translations?: IIngridientTranslations;
}

export interface IIngridientResponseItem {
    item: IIngridient;
}

export type TIngridients = Array<IIngridient>;