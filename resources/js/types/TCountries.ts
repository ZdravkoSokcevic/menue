import { TCurrencies } from "./TCurrencies";
import { ILanguage, TLanguages } from "./TLanguages";

export interface ICountry {
    id: string;
    common_name: string;
    name: string;
    flag_png?: string;
    flag_svg?: string;
    flag: string;
    language_id: string;
    currency_id: string;
    currencies?: TCurrencies;
    region: string;
    tld: string;
    frequent: boolean;
    languages: TLanguages;
    language?: ILanguage;
    mandatory: boolean;
}

export type TCountries = Array<ICountry>;