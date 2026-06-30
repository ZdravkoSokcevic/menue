import { TMenu } from "./Menu";
import { IPrice } from "./Prices";

export interface IDiscountTranslation {
    name: string;
}

export interface IDiscountTranslations {
    [lang: string]: IDiscountTranslation;
} 

export interface IDiscountDataTranslations {
    translations: IDiscountTranslations;
}

export enum DISCOUNT_TYPE {
    PERCENT = "percent",
    FIXED = "fixed"
}

export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

export interface IDiscount
{
    id: string;
    menu_id: string;
    portion_id: string;
    value: string;
    type: DISCOUNT_TYPE;
    picture?: string;
    time_from: string;
    time_to: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
    active_times: number;
    times: Array<DayOfWeek>;
    new?: boolean;
    menu?: TMenu;
    portion?: IPrice;
    translations?: IDiscountTranslations
}

export type TDiscounts = Array<IDiscount>;

export interface IDiscountResponseItem {
    item: IDiscount
}
