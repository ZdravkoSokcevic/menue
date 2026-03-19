import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { ICompanyTable, TTables } from "@/types/TCompanyTables";
import { IResponseItem } from "@/types/Api";

class TablesAPI extends Api
{
    static async createCompanyTable(data: ICompanyTable) 
    {
        if(data.company_id == '')
            delete data['company_id'];
        try {
            let success: AxiosResponse<TTables> = await this.post('/api/tables/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editCompanyTable(data: ICompanyTable) 
    {
        if(data.company_id == '')
            delete data['company_id'];
        try {
            const success: AxiosResponse<IResponseItem<ICompanyTable>> = await this.post(`/api/tables/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteCompanyTable(id: string)
    {
        try {
            const res = await this.get(`/api/tables/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TTables | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: TTables = [];
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
        try {
            let response = await this.get('/api/tables', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as ICompanyTable);
                });
            }
        }catch(err) {
            // debugger;
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default TablesAPI;