import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { IAllergen, TAllergens } from "@/types/Allergen";

class AllergensAPI extends Api
{
    static async createAllergen(data: IAllergen) 
    {
        try {
            let success: AxiosResponse<IResponseItem> = await this.post('/api/allergens/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editAllergen(data: IAllergen) 
    {
        try {
            const success: AxiosResponse<IResponseItem> = await this.post(`/api/allergens/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteAllergen(id: string)
    {
        try {
            const res = await this.get(`/api/allergens/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TAllergens | undefined >
    {
        let items: Array<IAllergen> = [];
        const data = {};
        try {
            let response = await this.get('/api/allergens', data, {});
            // console.log('### RESPONSE GET ALLERGENS ###');
            // console.log(response);
            // console.log('### ////RESPONSE GET ALLERGENS//// ###');
            if(response && response.data) {
                return Promise.resolve(response.data as TAllergens);
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
        }
    }
}

export default AllergensAPI;