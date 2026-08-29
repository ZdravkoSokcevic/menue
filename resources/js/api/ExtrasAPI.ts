import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { TExtras, IExtra, IExtraTranslations, IExtraResponseItem, IExtraDataTranslations } from "@/types/Extra";
import { Store } from "@/reducers/Store";

class ExtrasAPI extends Api
{
    static async createExtra(data: IExtra) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            let success: AxiosResponse<IResponseItem> = await this.post('/api/extras/create', reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editExtra(data: IExtra) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            const success: AxiosResponse<IResponseItem> = await this.post(`/api/extras/edit/${data.id}`, reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteExtra(id: string)
    {
        try {
            const res = await this.get(`/api/extras/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TExtras | undefined >
    {
        let items: TExtras = [];
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
        try {
            let response = await this.get('/api/extras', data, {});
            // console.log('### RESPONSE GET EXTRAS ###');
            // console.log(response);
            // console.log('### ////RESPONSE GET EXTRAS//// ###');
            if(response && response.data) {
                return Promise.resolve(response.data as TExtras);
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
        }
    }

    static async addOrEditTranslations(id:string, data: IExtraDataTranslations)
    {
        // TODO: Add logic for sending translations on beckend
        // return;
        try {
            const success: AxiosResponse<IExtraResponseItem> = await this.post(`/api/translations/extra/${id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }
}

export default ExtrasAPI;