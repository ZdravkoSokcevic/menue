import { ILicense, TLicenses } from "@/types/TLicenses";
import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";

class LicensesAPI extends Api
{
    static async getLicenses(): Promise<TLicenses>
    {
        let licenses: TLicenses = [];
        try {
            let licenses: AxiosResponse<TLicenses> | AxiosError = await this.get('/api/licenses', {}, {});
            // if(typeof licenses !== undefined && licenses.data.length) {
            //     // licenses.data.forEach((license:ILicense)=> licenses.push(license));
            // }
            if(licenses && typeof licenses == 'object')
                return Promise.resolve(licenses.data as TLicenses);
            else return Promise.resolve(licenses);
        }catch(e) {
            console.error(e);
            return Promise.resolve([]);
        } finally {
            // return Promise.resolve(licenses);
        }
    }
}

export default LicensesAPI;