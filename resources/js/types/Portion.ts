import { TPrices } from "./Prices";

export interface Portion
{
    menu_id: string;
    portion_size: string;
    currency_id: string;
    prices?: TPrices;
}

export type TPortions = Array<Portion>;