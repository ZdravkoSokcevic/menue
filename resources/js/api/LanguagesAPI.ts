import { TCountries } from "@/types/TCountries";
import Api from "./api";

class Languages extends Api
{
    static async getLanguages()
    {
        const data = {};
        try {
            let response = await this.get('/api/languages', data, {});
            // console.log('### RESPONSE GET LANGUAGES ###');
            // console.log(response);
            // console.log('### ////RESPONSE GET LANGUAGES//// ###');
            if(response && response.data) {
                return Promise.resolve(response.data as TCountries );
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
        }
    }
}

export default Languages;