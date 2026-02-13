import { TCompany } from "@/types/TCompanies";
import Storage from "./Storage";

class CompanyHelper
{
    static async storeDefaultCompany(company: TCompany)
    {
        Storage.set({key: 'default_company', value: JSON.stringify(company)});
    }

    static async loadDefaultCompany(): Promise<TCompany | null>
    {
        let company = await Storage.get('default_company');
        try {
            if(company)
                return Promise.resolve(JSON.parse(company));
            else return Promise.resolve(null);
        }catch(err) {
            if(typeof company == 'object')
                return Promise.resolve(company);
            return Promise.resolve(null);
        }
    }
}

export default CompanyHelper;