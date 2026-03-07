import { TCompany } from "@/types/TCompanies";
import Storage from "./Storage";
import { Store } from "@/reducers/Store";
import { removeDefaultCompany, setDefaultCompany } from "@/reducers/appSlice";

class CompanyHelper
{
    static async storeDefaultCompany(company: TCompany)
    {
        // Moved to persisted redux store instead of localStorage 
        Store.dispatch(setDefaultCompany(company));
    }

    static async loadDefaultCompany(): Promise<TCompany | null>
    {
        // Moved to persisted redux store instead of localStorage
        let company = await Store.getState().app.defaultCompany;
        return Promise.resolve(company);
    }

    static async removeSelectedCompany() {
        Store.dispatch(removeDefaultCompany({}));
        // Storage.remove({key: 'default_company'});
    }
}

export default CompanyHelper;