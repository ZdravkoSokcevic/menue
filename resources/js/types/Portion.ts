export interface Portion
{
    menu_id: string;
    portion_size: string;
    currency_id: string;
}

export type Portions = Array<Portion>;