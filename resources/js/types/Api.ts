import { AxiosResponse } from "axios";

export interface IApiErrorMessage {
    message: string;
}

export interface IPostMessage {
    message: string;
    data: any
}

export interface GetResult {
    data: any;
}

export interface IResponseItem<T=any> {
    item: T
}