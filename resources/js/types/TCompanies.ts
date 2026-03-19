import { AxiosResponse } from "axios";
import TUser from "./TUser";
import { ICountry } from "./TCountries";
import { ILicense } from "./TLicenses";

export type TCompany = {
    id?: string;
    name: string;
    email: string;
    logo?: File | string;
    description?: string;
    phone?: string;
    parent_id?: string;
    website?: string;
    country_id?: string | number;
    country?: ICountry;
    currency?: string | number | object;
    currency_id?: string | number;
    admin?: TUser;
    creator?: TUser;
    language_id: string | number;
    license_id: string | number;
    license?: ILicense;
    street: string;
}

export interface CompanyResponseItem {
    item: TCompany
}

export interface ICreateResponse extends AxiosResponse<CompanyResponseItem> {}



// export TCompanies;
export type TCompaniesArr = Array<TCompany>; 
// export default ;