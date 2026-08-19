import { CompanyResponseItem, TCompaniesArr, TCompany } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { AxiosResponse } from "axios";
import { Store } from "@/reducers/Store";
import { ADMIN_ROLE } from "@/types/Roles";

class CompaniesAPI extends Api
{

    static async createCompany(data: any)
    {
        try {
            let success: AxiosResponse<CompanyResponseItem> = await this.post('/api/companies/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editMenu(data: TCompany) 
    {
        try {
            const success: AxiosResponse<CompanyResponseItem> = await this.post(`/api/companies/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async getCompanies(): Promise<TCompaniesArr>
    {
        let companies: TCompaniesArr = [];
        try {
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

    static async deleteCompany(id: string)
    {
        const user = Store.getState().user.user;
        if(!user || !(user.id) || user.role != ADMIN_ROLE)
            return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        try {
            const res = await this.get(`/api/companies/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }
}

export default CompaniesAPI;