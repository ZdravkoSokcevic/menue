
export enum LicenseType {
    BASIC='basic',
    PREMIUM='premium',
    ENTERPRISE='enterprise',
    SUPERADMIN='superadmin',
    DEMO='demo'
}
export interface ILicense {
    id: string;
    name: string;
    quantity: string;
    description: string;
    picture: string;
    discount: string;
    discount_type: string;
    type: LicenseType;
}

export type TLicenses = Array<ILicense>;