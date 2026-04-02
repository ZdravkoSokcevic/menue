import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { IPreference, TPreferences } from "@/types/Preference";

class PreferencesAPI extends Api
{
    static async createPreference(data: IPreference) 
    {
        try {
            let success: AxiosResponse<IResponseItem> = await this.post('/api/preferences/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editPreference(data: IPreference) 
    {
        try {
            const success: AxiosResponse<IResponseItem> = await this.post(`/api/preferences/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deletePreference(id: string)
    {
        try {
            const res = await this.get(`/api/preferences/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TPreferences | undefined >
    {
        let items: TPreferences = [];
        const data = {};
        try {
            let response = await this.get('/api/preferences', data, {});
            // console.log('### RESPONSE GET EXTRAS ###');
            // console.log(response);
            // console.log('### ////RESPONSE GET EXTRAS//// ###');
            if(response && response.data) {
                return Promise.resolve(response.data as TPreferences);
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
        }
    }
}

export default PreferencesAPI;