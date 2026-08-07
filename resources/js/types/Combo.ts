import { TMenu } from "./Menu";
import { IPortionPrice, IPrice } from "./Prices";

export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

export interface IComboItem 
{
    combo_id: string;
    menu_id: string;
    portion_id: string;
    quantity: string;
    menu?: TMenu;
    portion?: IPortionPrice;
}

export type TComboItems = Array<IComboItem>;

export interface ICombo
{
    id: string;
    name: string;
    price_id: string;
    price?: string | IPrice;
    quantity?: string | number;
    active: boolean;
    active_times: string;
    times: Array<DayOfWeek>;
    time_from: string;
    time_to: string;
    start_at: string;
    end_at: string;
    items?: TComboItems;
    new?: boolean;
    portion?: IPortionPrice;
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

