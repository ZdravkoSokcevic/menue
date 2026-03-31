import { AxiosResponse } from "axios";
import { TComponentProps } from "./TComponentProps";
import { Ingridients } from "./Ingridient";
import { Preferences } from "./Preference";

export interface TMenu extends TComponentProps{
    name: string;
    description: string;
    picture?: File | String | null;
    quantity: string;
    company_id?: string;
    category_id: string;
    prep_time: number | string;
    ingridients?: Ingridients;
    preferents: Preferences
}

export interface MenuCreateResponseItem {
    item: TMenu
}

export interface ICreateResponse extends AxiosResponse<MenuCreateResponseItem> {}

