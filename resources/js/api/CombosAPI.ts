import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { ICombo, ICombosResponseItem } from "@/types/Combo";

class CombosAPI extends Api
{
    static async createCombo(data: ICombo) 
    {
        try {
            let success: AxiosResponse<ICombosResponseItem> = await this.post('/api/combos/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editCombo(data: ICombo) 
    {
        try {
            const success: AxiosResponse<ICombosResponseItem> = await this.post(`/api/combos/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteCombo(id: string)
    {
        try {
            const res = await this.get(`/api/combos/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<ICombo[] | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: Array<ICombo> = [];
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
        try {
            let response = await this.get('/api/combos', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as ICombo);
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

export default CombosAPI;