import { TCompaniesArr } from "@/types/TCompanies";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";

class MenuAPI extends Api
{
    static async createMenu(data: TMenu) 
    {
        debugger;
        try {
            let success = await this.post('/api/menu/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success });
        }catch(err) {
            return Promise.reject({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async getItems(): Promise<TMenu[] | undefined >
    {
        let companyId = Store.getState().app.defaultCompany.id;
        let items: Array<TMenu> = [];
        try {
            let response = await this.get('/api/menu', { company_id: companyId }, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as TMenu);
                });
            }
        }catch(err) {
            debugger;
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default MenuAPI;