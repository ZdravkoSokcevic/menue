import {TCompany, TCompaniesArr} from "@/types/TCompanies";
// import TComp from "@/types/TCompanies";

import {createSlice} from "@reduxjs/toolkit"

export const appSlice = createSlice({
    name: 'Store',
    initialState: {
        refreshKey: Math.random(),
        animationRefreshKey: Math.random(),
        isLoading: false,
        defaultCompany: {
            id: '',
            name: '',
            email: '',
        } as TCompany,
        settings: {
            theme: '',
            style: ''
        }
    },
    reducers: {
        animatedRefresh(state, action) {
            state.animationRefreshKey = Math.random();
        },
        setDefaultCompany(state, action) {
            state.defaultCompany = action.payload.value;
        },
        enableLoading(state, action) {
            state.isLoading = true;
        },
        disableLoading(state, action) {
            state.isLoading = false;
        },
    }
})

export const {  
    animatedRefresh,
    setDefaultCompany,
    enableLoading,
    disableLoading
} = appSlice.actions;

export default appSlice.reducer;