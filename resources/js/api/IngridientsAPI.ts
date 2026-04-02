import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { IIngridient, TIngridients } from "@/types/Ingridient";
import { IAllergen } from "@/types/Allergen";

class IngridientsAPI extends Api
{
    static async createIngridient(data: IIngridient) 
    {
        try {
            let success: AxiosResponse<IResponseItem> = await this.post('/api/ingridients/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editAllergen(data: IIngridient) 
    {
        let allergens: Array<string> = [];
        allergens = data.allergens?.map((allergen: IAllergen) => allergen.id) as Array<string>;
        
        // modify IIngridient bcs we have allergens as object
        // and in edit array of id's is required
        interface IPostAllergen {
            id: string;
            name: string,
            allergens: Array<string>,
            is_vegan: number
        }

        const postData: IPostAllergen = {
            id: data.id,
            name: data.name,
            allergens: allergens,
            is_vegan: data.is_vegan ? 1 : 0
        };
        postData.allergens = allergens;

        try {
            const success: AxiosResponse<IResponseItem> = await this.post(`/api/ingridients/edit/${data.id}`, postData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteIngridient(id: string)
    {
        try {
            const res = await this.get(`/api/ingridients/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TIngridients | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: Array<IIngridient> = [];
        const data = {};
        try {
            let response = await this.get('/api/ingridients', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as IIngridient);
                });
            }
        }catch(err) {
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default IngridientsAPI;