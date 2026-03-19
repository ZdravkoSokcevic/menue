import { ILicense, TLicenses } from "@/types/TLicenses";
import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { TCountries } from "@/types/TCountries";

class CountriesAPI extends Api
{
    static async getCountries(): Promise<TCountries>
    {
        let countries: TCountries = [];
        try {
            let countries: AxiosResponse<TCountries> | AxiosError = await this.get('/api/countries', {}, {});
            // if(typeof countries !== undefined && countries.data.length) {
            //     // countries.data.forEach((license:ILicense)=> countries.push(license));
            // }
            if(countries && typeof countries == 'object')
                return Promise.resolve(countries.data as TCountries);
            else return Promise.resolve(countries);
        }catch(e) {
            console.error(e);
            return Promise.resolve([]);
        } finally {
            // return Promise.resolve(countries);
        }
    }
}

export default CountriesAPI;