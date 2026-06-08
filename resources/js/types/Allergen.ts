export interface IAllergenTranslation {
    name: string;
}

export interface IAllergenTranslations {
    [lang: string]: IAllergenTranslation;
} 

export interface IAllergenDataTranslations {
    allergen_id: string;
    translations: IAllergenTranslations;
}


export interface IAllergen
{
    id: string;
    name: string;
    icon?: string | File;
    translations?: IAllergenTranslations;
}

export interface IAllergenResponseItem {
    item: IAllergen;
}


export type TAllergens = Array<IAllergen>;