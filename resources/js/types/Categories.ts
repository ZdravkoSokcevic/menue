import { AxiosResponse } from "axios";
import { TComponentProps } from "./TComponentProps";

export interface ICategoryTranslation {
    name: string;
}

export interface ICategoryTranslations {
    [lang: string]: ICategoryTranslation;
} 

export interface ICategoryDataTranslations {
    category_id: string;
    translations: ICategoryTranslations;
}

export interface ICategory extends TComponentProps{
    name: string;
    picture?: File | String | null;
    company_id?: string;
    translations?: ICategoryTranslations;
}

export type TCategories = Array<ICategory>

export interface ICategoriesResponseItem {
    item: ICategory
}

