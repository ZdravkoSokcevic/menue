import { removeDefaultCompany, setDefaultCompany } from "@/reducers/appSlice";
import { Store } from "@/reducers/Store";
import Storage from "./Storage";
import TUser from "@/types/TUser";
import Api from "@/api/api";
import { ImageDownloadResponse } from "@/types/Media";

class AppHelper
{
    static isAdmin(): boolean
    {
        const userSettings = Store.getState().user;
        const user: TUser = userSettings.user;
        const isLoggedIn: boolean = userSettings.isLoggedIn;
        return isLoggedIn &&
            user.role === 'admin'
    }

    static async downloadImage(imageSrc: string): Promise<ImageDownloadResponse>
    {
        let img = await Api.get(imageSrc, {}, {});
        if(img && img.data) {
            const reader = new window.FileReader();
            debugger;
            reader.readAsDataURL(img.data);
            reader.onload = () => {
                const result = reader.result;
                return Promise.resolve(result);
                // document?.getElementById("img").setAttribute("src", reader.result);
            }; 
        }else return Promise.resolve(null);
    }
}

export default AppHelper;