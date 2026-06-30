export interface IComboItem 
{
    combo_id: string;
    menu_id: string;
    portion_id: string;
    quantity: string;
}

export type TComboItems = Array<IComboItem>;

export interface ICombo
{
    name: string;
    price_id: string;
    price?: string;
    active: boolean;
    active_times: string;
    time_from: string;
    time_to: string;
    start_at: string;
    end_at: string;
    items?: TComboItems;
    
}

export type TCombos = Array<ICombo>;