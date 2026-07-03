import { IPrice } from "./Prices";

export interface IExtraTranslation {
    name: string;
}

export interface IExtraTranslations {
    [lang: string]: IExtraTranslation;
} 

export interface IExtraDataTranslations {
    extra_id: string;
    translations: IExtraTranslations;
}

export interface IAPIExtra {
    name: string;
    price?: number;
    prices?: Array<IPrice>;
    description: string;
    translations?: IExtraTranslations;
}

// USED IN CREATE/EDIT MENU MODALS
export interface IMenuExtra {
    id: string;
    name: string;
    price?: number;
    prices?: Array<IPrice>;
}

export interface IExtra extends IAPIExtra
{
    id: string;
}

export type TExtras = Array<IExtra>;

export interface IExtraResponseItem {
    item: IExtra;
}

export type TMenuExtras = Array<IMenuExtra>;