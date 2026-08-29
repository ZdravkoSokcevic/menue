import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { TExtras, IExtra } from "@/types/Extra";
import { OrderItems, TOrders } from "@/types/Order";
import { Store } from "@/reducers/Store";

interface IGetItemsData {
    page?: number;
    status?: string;
    company_id: string;
}

class OrderAPI extends Api
{

    static async getItems(page?: number, status?: string): Promise<TOrders | undefined >
    {
        let correctStatus: unknown = status;
        if(isNaN(correctStatus as number)) {
            // we need this case here
            switch(correctStatus)
            {
                case 'all': correctStatus = undefined; break;
                case 'new': correctStatus = '0'; break;
                case 'preparing': correctStatus = '1'; break;
                case 'ready': correctStatus = '2'; break;
                case 'paid': correctStatus = '3'; break;
                default: correctStatus = undefined;
            }
        }
        let wantedPage = 0;
        if(page)
            wantedPage = page;
        let items: OrderItems = [];

        const data: IGetItemsData = {
            page: wantedPage,
            company_id: Store.getState().app.defaultCompany.id as string
        };

        if(correctStatus) {
            data['status'] = correctStatus as string;    
        }

        try {
            let response = await this.get('/api/orders', data, {});
            // console.log('### RESPONSE GET EXTRAS ###');
            // console.log(response);
            // console.log('### ////RESPONSE GET EXTRAS//// ###');
            if(response && response.data) {
                return Promise.resolve(response.data as TOrders);
            }
        }catch(err) {
            console.error(err);
            return Promise.resolve([]);
        }finally {
        }
    }

    static async deleteOrder(id: string)
    {
        try {
            const res = await this.get(`/api/orders/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async changeStatus(id: string, status: string)
    {
        try {
            const res = await this.post(`/api/orders/edit/${id}`, {status: status}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }  
    }
}

export default OrderAPI;