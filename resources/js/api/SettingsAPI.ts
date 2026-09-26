import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { ICompanyTable, TTables } from "@/types/TCompanyTables";
import { IResponseItem } from "@/types/Api";
import { ICompanySettingsAPIResponseType, ICompanySettingsAxiosResponseType } from "@/types/TCompanySettings";

class SettingsAPI extends Api
{
    static async getSettings(): Promise<ICompanySettingsAPIResponseType>
    {
        try {
            let response = await this.get('/api/company/settings', {}, {});
            if(response && response.data) {
                return {
                    success: true, 
                    settings: response.data
                };
            }
            
            return { 
                success: false, 
                settings: [] 
            };
        }catch(err) {
            // debugger;
            return { 
                success: false, 
                reason: (err as Error).cause as string 
            };
        }
    }

    static async saveCompanySettings(data: {}): Promise<ICompanySettingsAPIResponseType>
    {
        let reqData: any = {
            settings: data
        };
        try {
            let response: AxiosResponse<ICompanySettingsAxiosResponseType> = await this.post('/api/company/settings', reqData, {}, true);
            console.info(response);
            if(response && response.data)
                return { 
                    success:true, 
                    settings: response.data.settings 
                };
            return { 
                success:false, 
                settings: {}, 
                reason: 'Unexpected error occured' 
            }
        }catch(err: any) {
            const errorMessage = err?.response?.data?.message || (err as Error)?.message || 'An unexpected error occured';
            return { 
                success:false, 
                settings: {}, 
                reason: errorMessage
            }
        }
    }
}

export default SettingsAPI;