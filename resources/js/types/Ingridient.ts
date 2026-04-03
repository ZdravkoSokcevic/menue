import { TAllergens } from "./Allergen";

export type TMenuIngridients = Array<string>;

export interface IIngridient
{
    id: string;
    name: string;
    allergens?: TAllergens;
    is_vegan: boolean;
}

export type TIngridients = Array<IIngridient>;