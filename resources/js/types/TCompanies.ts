
export type TCompany = {
    id: string;
    name: string;
    email: string;
    logo?: string;
    description?: string;
    phone?: string;
    parent_id?: string;
}

// export TCompanies;
export type TCompaniesArr = Array<TCompany>; 
// export default ;