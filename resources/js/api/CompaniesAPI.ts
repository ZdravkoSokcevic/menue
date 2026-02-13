import { TCompaniesArr } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";

class CompaniesAPI extends Api
{
    static async getCompanies(): Promise<TCompaniesArr>
    {
        let companies: TCompaniesArr = [];
        try {
            // Means that we have local access token,
            // but we need to check on backend too
            let creds = await localStorage.getItem('access_token');
            if(!creds || creds == null) {
                console.error('Unauthorized!');
                return Promise.resolve([]);
            }
            let companiesRes = await this.get('/api/companies/all', {}, {});
            if(typeof companiesRes !== undefined && companiesRes.data.length) {
                companiesRes.data.forEach((company:any)=> companies.push(company));
            }
        }catch(e) {
            console.error(e);
            return Promise.resolve([]);
        } finally {
            return Promise.resolve(companies);
        }
    }
}

export default CompaniesAPI;