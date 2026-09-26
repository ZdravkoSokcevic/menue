import { ICode } from "./App";

// }
export interface IRoom {
    id: string;
    name: string;
    company_id?: string;
    code?: ICode;
    availability?: boolean;
}

export type TRooms = Array<IRoom>;