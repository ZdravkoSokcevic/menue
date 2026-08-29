import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { IDiscount, IDiscountDataTranslations, IDiscountResponseItem } from "@/types/Discount";

class DiscountsAPI extends Api
{
    static async createDiscount(data: IDiscount) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            let success: AxiosResponse<IDiscountResponseItem> = await this.post('/api/discounts/create', reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editDiscount(data: IDiscount) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            const success: AxiosResponse<IDiscountResponseItem> = await this.post(`/api/discounts/edit/${data.id}`, reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteDiscount(id: string)
    {
        try {
            const res = await this.get(`/api/discounts/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<IDiscount[] | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: Array<IDiscount> = [];
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
        try {
            let response = await this.get('/api/discounts', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as IDiscount);
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

    static async addOrEditTranslations(id:string, data: IDiscountDataTranslations)
    {
        // TODO: Add logic for sending translations on beckend
        // return;
        try {
            const success: AxiosResponse<IDiscountResponseItem> = await this.post(`/api/translations/discounts/${id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }
}

export default DiscountsAPI;