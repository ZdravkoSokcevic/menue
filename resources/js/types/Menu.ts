import { AxiosResponse } from "axios";
import { TComponentProps } from "./TComponentProps";

export interface TMenu extends TComponentProps{
    name: string;
    description: string;
    picture?: File | String | null;
    quantity: string;
    company_id?: string;
}

export interface MenuCreateResponseItem {
    item: TMenu
}

export interface ICreateResponse extends AxiosResponse<MenuCreateResponseItem> {}

