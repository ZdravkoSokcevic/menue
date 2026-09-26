import Api from "./api";
import { Store } from "@/reducers/Store";
import { AxiosResponse } from "axios";
import { IResponseItem } from "@/types/Api";
import { IRoom, TRooms } from "@/types/TRooms";

class RoomsAPI extends Api
{
    static async createRoom(data: IRoom) 
    {
        if(data.company_id == '')
            delete data['company_id'];
        let reqData: any = data;
        try {
            let success: AxiosResponse<TRooms> = await this.post('/api/rooms/create', reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editRoom(data: IRoom) 
    {
        if(data.company_id == '')
            delete data['company_id'];
        let reqData: any = data;
        try {
            const success: AxiosResponse<IResponseItem<IRoom>> = await this.post(`/api/rooms/edit/${data.id}`, reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async deleteRoom(id: string)
    {
        try {
            const res = await this.get(`/api/rooms/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }

    static async getItems(): Promise<TRooms | undefined >
    {
        let companyId = Store.getState().app.defaultCompany?.id;
 
        // debugger;
        let items: TRooms = [];
        const data = {}
        try {
            let response = await this.get('/api/rooms', data, {});
            if(response && response.data) {
                response.data.map((i:any) => {
                    items.push(i as IRoom);
                });
            }
        }catch(err) {
            // debugger;
            return Promise.resolve([]);
        }finally {
            // debugger;
            // return Promise.resolve([]);
            return Promise.resolve(items);
        }
    }
}

export default RoomsAPI;