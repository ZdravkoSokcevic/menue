
// export enum LicenseType {
//     BASIC='basic',
//     PREMIUM='premium',
//     ENTERPRISE='enterprise',
//     SUPERADMIN='superadmin',
//     DEMO='demo'

import { ICode } from "./App";

// }
export interface ICompanyTable {
    id: string;
    name: string;
    company_id?: string;
    code?: ICode;
    availability?: boolean;
}

export type TTables = Array<ICompanyTable>;