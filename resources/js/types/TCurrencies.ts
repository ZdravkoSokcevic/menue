
export interface ICurrency {
    id: string;
    name: string;
    code: string;
    symbol: string;
    country_id: string;
}

export type TCurrencies = Array<ICurrency>;