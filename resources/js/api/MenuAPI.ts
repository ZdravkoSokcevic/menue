import { TCompaniesArr } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { ICreateResponse, MenuCreateResponseItem, TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";

class MenuAPI extends Api
{
    static async createMenu(data: TMenu) 
    {
        try {
            let success: AxiosResponse<MenuCreateResponseItem> = await this.post('/api/menu/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editMenu(data: TMenu) 
    {
        try {
            const success: AxiosResponse<MenuCreateResponseItem> = await this.post(`/api/menu/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteMenu(id: string)
    {
        try {
            const res = await this.get(`/api/menu/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TMenu[] | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
        const data: {company_id?: string} = {}
        if(companyId != '')
            data.company_id = companyId;
        
        let items: Array<TMenu> = [];
        console.log('Default company id: ' + companyId);
        try {
            let response = await this.get('/api/menu', { company_id: companyId }, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as TMenu);
                });
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default MenuAPI;