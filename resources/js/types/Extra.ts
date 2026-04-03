export interface IAPIExtra {
    name: string;
    price?: number;
    description: string;
}

// USED IN CREATE/EDIT MENU MODALS
export interface IMenuExtra {
    id: string;
    name: string;
    price: number;
}

export interface IExtra extends IAPIExtra
{
    id: string;
}

export type TExtras = Array<IExtra>;

export type TMenuExtras = Array<IMenuExtra>;