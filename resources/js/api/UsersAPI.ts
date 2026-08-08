import Api from "./api";
import { AxiosResponse } from "axios";
import { Store } from "@/reducers/Store";
import TUser, { TUsers, UserResponseItem } from "@/types/TUser";

class UsersAPI extends Api
{

    static async createUser(data: any)
    {
        try {
            let success: AxiosResponse<UserResponseItem> = await this.post('/api/users/create', data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editUser(data: TUser) 
    {
        try {
            const success: AxiosResponse<UserResponseItem> = await this.post(`/api/users/edit/${data.id}`, data, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async getUsers(): Promise<TUsers>
    {
        let users: TUsers = [];
        try {
            let usersRes = await this.get('/api/users', {}, {});
            if(typeof usersRes !== undefined && usersRes.data.length) {
                usersRes.data.forEach((company:any)=> users.push(company));
            }
        }catch(e) {
            console.error(e);
            return Promise.resolve([]);
        } finally {
            return Promise.resolve(users);
        }
    }

    static async deleteUser(id: string)
    {
        const user = Store.getState().user.user;
        if(!user || !(user.id) || user.role != 'admin')
            return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        try {
            const res = await this.get(`/api/users/delete/${id}`, {}, {});
            if(res && res.status == 200 && res.data && res.data.message == 'success')
                return Promise.resolve({ success: true });
            else return Promise.resolve({ success: false, data: {}, reason: 'Not found' });
        }catch(err) {
            return Promise.resolve({ success: false, data: {}, reason: (err as Error).cause });
        }
    }
}

export default UsersAPI;