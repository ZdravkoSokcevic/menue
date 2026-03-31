export interface IAllergen
{
    id: string;
    name: string;
    icon?: string | File;
}

export type TAllergens = Array<IAllergen>;