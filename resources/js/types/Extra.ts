export interface IAPIExtra {
    name: string;
    price?: number;
    description: string;
}
export interface IExtra extends IAPIExtra
{
    id: string;
}

export type TExtras = Array<IExtra>;