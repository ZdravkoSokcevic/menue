
export interface ILanguage {
    id?: string;
    name: string;
    code: string;
    country_id?: string;
}

export type TLanguages = Array<ILanguage>;