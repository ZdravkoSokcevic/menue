import { TAllergens } from "./Allergen";

export interface IIngridient
{
    id: string;
    name: string;
    allergens?: TAllergens;
    is_vegan: boolean;
}

export type TIngridients = Array<IIngridient>;