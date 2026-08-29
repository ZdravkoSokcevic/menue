import Api from "./api";
import { AxiosResponse } from "axios";
import { Store } from "@/reducers/Store";
import TUser, { TUsers, UserResponseItem } from "@/types/TUser";
import { ADMIN_ROLE } from "@/types/Roles";

class UsersAPI extends Api
{

    static async createUser(data: any)
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            let success: AxiosResponse<UserResponseItem> = await this.post('/api/users/create', reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async editUser(data: TUser) 
    {
        let reqData: any = data;
        let company = Store.getState().app.defaultCompany;
        if(company)
            reqData['company_id'] = company.id;
        try {
            const success: AxiosResponse<UserResponseItem> = await this.post(`/api/users/edit/${data.id}`, reqData, {}, true);
            if(success)
                return Promise.resolve({ success:true, data: success.data });
        }catch(err) {
            return Promise.resolve({ success:false, data: {}, reason: (err as Error).cause })
        }
    }

    static async getUsers(): Promise<TUsers>
    {
        const data: any = {};
        let companyId = Store.getState().app.defaultCompany.id;
        if(companyId)
            data['company_id'] = companyId
        let users: TUsers = [];
        try {
            let usersRes = await this.get('/api/users', data, {});
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
        if(!user || !(user.id) || user.role != ADMIN_ROLE)
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