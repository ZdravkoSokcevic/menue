import { Store } from "@/reducers/Store";
import Api from "./api";
import Storage from "@/helpers/Storage";
import { setIsLoggedIn, setLoggedIn, setToken } from "@/reducers/userSlice";
import TUser from "@/types/TUser";

class Login extends Api
{
    static async login(creditials: any)
    {
        try {
            // adapt property names to api
            let success = await this.post('/api/login', creditials, {});
            if(success && success.data) {
                const token = success.data.access_token;
                // Moved to persisted store
                Store.dispatch(setLoggedIn({ user: success.data.user as TUser }));
                Store.dispatch(setToken({token: success.data.access_token}));
                Store.dispatch(setIsLoggedIn({ value: true }));
                return success.data;
            }
        }catch(e: any) {
            console.error(e);
            return false;
        }
    }

    static async isLoggedIn()
    {
        return Store.getState().user.isLoggedIn;
    }

    static async getLoggedIn()
    {
        return Store.getState().user.user;
    }
}

export default Login;