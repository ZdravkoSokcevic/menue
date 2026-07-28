export interface IPortionPrice {
    id?: string;
    name: string;
    portion_size: number;
    portion_unit?: string;
    price: number;
    prices: TPrices;
}

export interface IPrice {
    id?: string;
    name?: string;
    price: number;
    currency_id: string;   
}

export type TPrices = Array<IPortionPrice>;