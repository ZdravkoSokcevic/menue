
import Axios, { AxiosError, AxiosResponse } from "axios";
import {root as API_BASE_URL, root} from "../config"
const AxiosApiInstance = Axios.create();
// import toast from "react-hot-toast";
import { IApiErrorMessage } from "../types/Api";
import { IGetResult } from "@/types/Storage";
import { toast } from 'react-toastify';
import { Store } from "@/reducers/Store";
import { redirect, useNavigate } from "react-router-dom";
// import { ServerResponse } from "../types/ServerResponse"

// const navigate = useNavigate();

AxiosApiInstance.interceptors.request.use(
    async config => {
        const tokenObj: string = await Store.getState().user.token as string;
        // console.log('### TOKEN OBJECT API MIDDLEWARE ###')
        // console.log(tokenObj);
        // console.log('////### TOKEN OBJECT API MIDDLEWARE ###')

        const token: string = tokenObj ?? '';
        config.withCredentials = true;
        config.withXSRFToken = true;
        // @ts-ignore
        config.headers = {
            Authorization: `Bearer ${token}`, 
            ...config.headers,
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
)

AxiosApiInstance.interceptors.response.use((response: AxiosResponse<any, any>) => {
    console.log(response);
    return response;
}, (error: AxiosError) => {
    if(error.response && error.response.status === 401) {
        console.error('Unauthorized');
        toast('Unauthorized');
        // not working here
        // navigate('/admin');
        // ('/login');
    }else if(error.response && error.response.status === 422) {
        const errors: {errors: []} = error.response.data as {errors: []};
        debugger;
        toast(error.response.statusText, { type: 'error' });
    }
})
console.log(AxiosApiInstance);

export default class Api {
    static apiUrl   = API_BASE_URL;
    static apiToken = null; 
    constructor() {
        Api.apiToken = null;
        Api.apiUrl = API_BASE_URL;
    }

    static async fetchCategories() {
        console.log(Api.apiUrl);
        try {
            let response = await AxiosApiInstance(Api.apiUrl + "/category", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });
            if(response && response.data) {
                // response.data.map((category:Category,index) => category.selected = 0);
                return Promise.resolve(response.data);
            }else return Promise.resolve([]);
        }catch(e) {
            return Promise.resolve([]);
        }
    }
    /**
     * @param(path) : string
     * @param(queryParams) : Object
     */
    static async get<T=any, R= AxiosResponse<T>>(path: string, queryParams: object, headers: object): Promise<AxiosResponse> {
        try {
            let response = await AxiosApiInstance(Api.apiUrl + path, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                params: queryParams
            })

            if(response && response.data) {
                return Promise.resolve(response);
            }

            let data: any = null;
            return Promise.resolve(data);
        }catch(e) {
            return Promise.reject(e);
        }
    }

    /**
     * @param(path) : string
     * @param(queryParams) : Object
     */
    static async getExternal<T=any, R= AxiosResponse<T>>(path: string, queryParams: object, headers: object): Promise<AxiosResponse> {
        // console.log(path)
        try {
            let response = await Axios(path, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                params: queryParams
            })

            if(response && response.data) {
                return Promise.resolve(response);
            }

            let data: any = null;
            return Promise.resolve(data);
        }catch(e) {
            return Promise.reject(e);
        }
    }

    /**
     * @param(path) : string
     * @param(queryParams) : Object
     */
         static async getCustom<T=any, R= AxiosResponse<T>>(url: string, queryParams: object, headers: object): Promise<AxiosResponse> {
            // console.log(url);
            try {
                let response = await AxiosApiInstance(url, {
                    method: "GET",
                    withCredentials: true,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                })
    
                if(response && response.data) {
                    return Promise.resolve(response);
                }
    
                let data: any = null;
                return Promise.resolve(data);
            }catch(e) {
                return Promise.reject(e);
            }
        }

    static async post<T=any, R= AxiosResponse<T>>(path: string, data: object, headers: object, isMultipartData=false): Promise<AxiosResponse> {
        try {
            let allHeaders = {
                Accept: "application/json",
                'Content-Type': isMultipartData ? 'multipart/form-data': "application/json"
            }
            let empty:any = {};
            if(Object.keys(headers).length > 1)
                allHeaders = Object.assign(empty, headers);
            let res = await AxiosApiInstance(Api.apiUrl + path, {
                method: "POST",
                data: data,
                headers: allHeaders
            })

            let response = res;

            if(response)
                return Promise.resolve(response);
            else return Promise.reject(res.data);
        }catch(e) {
            console.error('Request failed to: ' + path)
            return Promise.reject(e);
        }
    }

    static async checkConnection<T=any, R= AxiosResponse<T>>() {
        const root = Api.apiUrl
        try {
            let res = await Api.getExternal(root, {}, {});
            // toast(res.data.message);
            if(res.data.message !== 'Pfetch api')
                toast('Server not available at moment');
        }catch(e) {
            let err: IApiErrorMessage = e as IApiErrorMessage;
            console.error(e);
            toast('Server not available at moment');
        }
    }
    
    /**
     * This method checks if file exists and returns boolean value of existment
     * @param path: string | Example (https://pfetchapi/users/1.png or /users/1.png)
     * @returns Promise<boolean>
     */
    static async checkFileExists<T=any, R= AxiosResponse<T>>(path: string, type?:any): Promise<boolean> {
        const root = Api.apiUrl;
        return Promise.resolve(true);

        /**
         * NOTE: we cannot test every file on every url, 
         * because CORS blocked us
         */
        // try {
        //     let res = undefined;
        //     let isNotRelativePath = /(http(s?)):\/\//i.test(path);
        //     console.log({path: path, isRelativePath: isNotRelativePath});
        //     if(!isNotRelativePath) {
        //         res = await Api.get(path, {}, {});
        //     } else res = await Api.getExternal(path, {}, {});
        //     console.log({
        //         image: path,
        //         exists: res.status != 404,
        //         response: res
        //     });

            

        //     // debugger;
        //     if(res.status != 404 ) {
        //         // debugger;
        //         // check is response text/html
        //         // let contentType = res.headers['content-type'];
        //         // if(contentType?.includes('text/html'))
        //             // return Promise.resolve(false)
        //         // else return Promise.resolve(true);
        //         return Promise.resolve(true);
        //     } else return Promise.resolve(false);

        // }catch(e) {
        //     let err: IApiErrorMessage = e as IApiErrorMessage;
        //     console.error(e);
        //     return Promise.resolve(false);
        // }
    }
}