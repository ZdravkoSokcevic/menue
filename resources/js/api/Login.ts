import Api from "./api";

class Login extends Api
{
    static async login(creditials: any)
    {
        try {
            // adapt property names to api
            let success = await this.post('/api/login', creditials, {});
            if(success && success.data)
                return success.data;
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
}

export default Login;