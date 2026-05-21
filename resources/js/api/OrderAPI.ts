import Api from "./api";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { TExtras, IExtra } from "@/types/Extra";
import { OrderItems, TOrders } from "@/types/Order";

class OrderAPI extends Api
{

    static async getItems(page?: number): Promise<TOrders | undefined >
    {
        let wantedPage = 0;
        if(page)
            wantedPage = page;
        let items: OrderItems = [];
        const data = {
            page: wantedPage
        };
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
}

export default OrderAPI;