import TUser from "@/types/TUser";
import {createSlice} from "@reduxjs/toolkit"
export const initialUser: TUser = {
    id: '',
    name: '',
    first_name: '',
    last_name: '',
    username: '',
    company_id: '',
    email: '',
    password: '',
    role: 'admin'
}
export const userSlice = createSlice({
    name: 'User',
    initialState: {
        user:initialUser as TUser,
        token: '' as string,
        isLoggedIn: false as boolean
    },
    reducers: {
        login: (state, action: any) => {
            state.user = Object.assign({}, action.payload.user);
        },
        logout: (state, action) => {
            state.user = initialUser;
        },
        setToken: (state, action: any) => {
            state.token = action.payload.token as string;
        },
        removeToken: (state, action: any) => {
            state.token = '';
        },
        setIsLoggedIn(state, action) {
            state.isLoggedIn = action.payload.value;
        }
    }
})

export const { 
    login, 
    logout, 
    setIsLoggedIn,
    setToken,
    removeToken 
} = userSlice.actions;

export default userSlice.reducer;