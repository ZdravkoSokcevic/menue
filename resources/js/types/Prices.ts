export interface IPortionPrice {
    name: string;
    portion_size: number;
    portion_unit?: string;
    price: number;
}

export interface IPrice {
    name?: string;
    price: number;
    currency_id: string;   
}

export type TPrices = Array<IPortionPrice>;