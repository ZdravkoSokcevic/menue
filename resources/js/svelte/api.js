import axios from "axios";
const AxiosApiInstance = axios.create();
class Api
{
    static apiUrl   = '/api/';
    static apiToken = null; 
    /**
     * @param(path) : string
     * @param(queryParams) : Object
     */
    static async get(path, queryParams, headers ) {
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

            let data = null;
            return Promise.resolve(data);
        }catch(e) {
            return Promise.reject(e);
        }
    }

    static async post(path, data, headers, isMultipartData=false) {
        // try {
            let allHeaders = {
                Accept: "application/json",
                'Content-Type': isMultipartData ? 'multipart/form-data': "application/json"
            }
            let empty = {};
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
        // }catch(e) {
        //     console.error('Request failed to: ' + path)
        //     return Promise.reject(e);
        // }
    }
}

export default Api;