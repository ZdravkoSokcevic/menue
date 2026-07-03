import { TMenu } from "./Menu";
import { IPortionPrice, IPrice } from "./Prices";

export interface IComboItem 
{
    combo_id: string;
    menu_id: string;
    portion_id: string;
    quantity: string;
    menu?: TMenu;
}

export type TComboItems = Array<IComboItem>;

export interface ICombo
{
    id: string;
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
    new?: boolean;
    
}

export type TCombos = Array<ICombo>;

// USED FOR MANAGING MULTIPLE SELECTIONS OF MENU ITEM
// WHICH ALL HAVE THEIR OWN SELECTED PORTION
export interface IComboSelection {
    menuItem: TMenu;
    selectedPortion: IPortionPrice;
}

export type TArrayOfComboSelection = Array<IComboSelection>;

export interface IComboSimpleSelection {
    menu_id: string;
    portion_id: string;
}

export type TArrayOfComboSimpleSelections = Array<IComboSimpleSelection>;

export interface ICombosResponseItem {
    item: ICombo
}

