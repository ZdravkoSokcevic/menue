import { removeDefaultCompany, setDefaultCompany } from "@/reducers/appSlice";
import { Store } from "@/reducers/Store";
import Storage from "./Storage";
import TUser from "@/types/TUser";
import Api from "@/api/api";
import { ImageDownloadResponse } from "@/types/Media";
import { ADMIN_ROLE } from "@/types/Roles";

class AppHelper
{
    static isAdmin(): boolean
    {
        const userSettings = Store.getState().user;
        const user: TUser = userSettings.user;
        const isLoggedIn: boolean = userSettings.isLoggedIn;
        return isLoggedIn &&
            user.role === ADMIN_ROLE
    }

    static async downloadImage(imageSrc: string): Promise<ImageDownloadResponse>
    {
        let img = await Api.get(imageSrc, {}, {});
        if(img && img.data) {
            const reader = new window.FileReader();
            reader.readAsDataURL(img.data);
            reader.onload = () => {
                const result = reader.result;
                return Promise.resolve(result);
                // document?.getElementById("img").setAttribute("src", reader.result);
            }; 
        }else return Promise.resolve(null);
    }

    // TODO: read from store to obtain default company currency
    static getDefaultCurrency(): string
    {
        return 'USD';
    }

    // TODO: read from store to obtain default weight
    static getDefaultWeightMeasurment(): string
    {
        return 'g';
    }

    // TODO: read from store to obtain default company language
    // TODO: upgrade: read first from user settings, and if not set, read from company
    static getLanguage(): string
    {
        return 'en';
    }

    static getTodayAtMidnight = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };
}

export default AppHelper;