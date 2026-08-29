import { TCompaniesArr } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { ICreateResponse, IMenuDataTranslations, IMenuTranslations, MenuCreateResponseItem, TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { IPortionPrice, TPrices } from "@/types/Prices";

class MenuAPI extends Api
{
    static async createMenu(data: TMenu) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            let success: AxiosResponse<MenuCreateResponseItem> = await this.post('/api/menu/create', reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editMenu(data: TMenu) 
    {
        let prices: any = [];
        if(data.prices) {
            data.prices.map((price: IPortionPrice) => {
                let p = price as any;
                prices.push({
                    name: price.name,
                    portion_size: price.portion_size,
                    portion_unit: price.portion_unit,
                    price: p.prices.price
                });
            })
        }
        data['prices'] = prices;

        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            const success: AxiosResponse<MenuCreateResponseItem> = await this.post(`/api/menu/edit/${data.id}`, reqData, {}, true);
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
        // console.log('Default company id: ' + companyId);
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

    // static async addOrEditTranslations(id:string, data: IMenuTranslations): Promise<TMenu | undefined>
    static async addOrEditTranslations(id:string, data: IMenuDataTranslations)
    {
        // TODO: Add logic for sending translations on beckend
        // return;
        try {
            const success: AxiosResponse<MenuCreateResponseItem> = await this.post(`/api/translations/menu/${id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }
}

export default MenuAPI;