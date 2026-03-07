import { AxiosResponse } from "axios";
import { TComponentProps } from "./TComponentProps";

export interface ICategory extends TComponentProps{
    name: string;
    picture?: File | String | null;
    company_id?: string;
}

export interface ICategoriesResponseItem {
    item: ICategory
}

