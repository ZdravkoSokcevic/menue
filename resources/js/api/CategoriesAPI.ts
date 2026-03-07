import { TCompaniesArr } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { ICreateResponse, MenuCreateResponseItem, TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { ICategoriesResponseItem, ICategory } from "@/types/Categories";

class MenuAPI extends Api
{
    static async createCategory(data: ICategory) 
    {
        try {
            let success: AxiosResponse<ICategoriesResponseItem> = await this.post('/api/categories/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editCategory(data: ICategory) 
    {
        try {
            const success: AxiosResponse<ICategoriesResponseItem> = await this.post(`/api/categories/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteCategory(id: string)
    {
        try {
            const res = await this.get(`/api/categories/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<ICategory[] | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: Array<ICategory> = [];
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
        try {
            let response = await this.get('/api/categories', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as ICategory);
                });
            }
        }catch(err) {
            debugger;
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default MenuAPI;