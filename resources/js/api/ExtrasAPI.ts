import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { TExtras, IExtra } from "@/types/Extra";

class ExtrasAPI extends Api
{
    static async createExtra(data: IExtra) 
    {
        try {
            let success: AxiosResponse<IResponseItem> = await this.post('/api/extras/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editExtra(data: IExtra) 
    {
        try {
            const success: AxiosResponse<IResponseItem> = await this.post(`/api/extras/edit/${data.id}`, data, {}, true);
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
        const data = {};
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
}

export default ExtrasAPI;