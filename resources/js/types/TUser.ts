
interface TUser {
    id: string;
    name: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    company_id?: string;
    role?: string;
    email?: string;
    password?: string;
}

export interface TUserSettings {
    user: TUser,
    token?: string,
    isLoggedIn: false
}

export type TUsers = Array<TUser>;

export interface UserResponseItem {
    item: TUser;
}

export default TUser;