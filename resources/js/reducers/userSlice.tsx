import TUser from "@/types/TUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
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
    name: 'user',
    initialState: {
        user:initialUser as TUser,
        token: '' as string,
        isLoggedIn: false as boolean
    },
    reducers: {
        setLoggedIn: (state, action: PayloadAction<{user: TUser}>) => {
            state.user = Object.assign({}, action.payload.user);
            state.isLoggedIn = true;
        },
        removeLoggedIn: (state, action) => {
            state.user = initialUser;
        },
        setToken: (state, action: PayloadAction<{token: string}>) => {
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
    setLoggedIn, 
    removeLoggedIn, 
    setIsLoggedIn,
    setToken,
    removeToken 
} = userSlice.actions;

export default userSlice.reducer;