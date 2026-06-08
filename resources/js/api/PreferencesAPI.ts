import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { IPreference, IPreferenceDataTranslations, IPreferenceResponseItem, IPreferenceTranslations, TPreferences } from "@/types/Preference";
import { Store } from "@/reducers/Store";

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
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        const data: {company_id?: string} = {}
        if(companyId)
            data.company_id = companyId;
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

    static async addOrEditTranslations(id:string, data: IPreferenceDataTranslations)
    {
        // TODO: Add logic for sending translations on beckend
        // return;
        try {
            const success: AxiosResponse<IPreferenceResponseItem> = await this.post(`/api/translations/preference/${id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }    

}

export default PreferencesAPI;