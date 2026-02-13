import Api from "./api";
import Storage from "@/helpers/Storage";

class Login extends Api
{
    static async login(creditials: any)
    {
        try {
            // adapt property names to api
            let success = await this.post('/api/login', creditials, {});
            if(success && success.data) {
                console.log(success);
                const token = success.data.access_token;
                Storage.set({key: 'access_token', value: token });
                Storage.set({ key: 'user', value: JSON.stringify(success.data.user) });
                return success.data;
            }
        }catch(e: any) {
            console.error(e);
            return false;
        }
    }

    static async isLoggedIn()
    {
        try {
            // Means that we have local access token,
            // but we need to check on backend too
            let creds = await localStorage.getItem('access_token');
            if(!creds || creds == null)
                return false;
            let apiUser = await this.post('/api/users/me', {}, {});
            if(apiUser && apiUser.data)
                return true;
        }catch(e) {
            console.error(e);
            return false;
        }
    }

    static async getLoggedIn()
    {
        try {
            let user = await Storage.get('user');
            if(user)
                return JSON.parse(user);
            else return null;
        }catch(err) {
            console.error(err);
            return null;
        }
    }
}

export default Login;