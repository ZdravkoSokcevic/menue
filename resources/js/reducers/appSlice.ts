import {TCompany, TCompaniesArr} from "@/types/TCompanies";
// import TComp from "@/types/TCompanies";

import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export const appSlice = createSlice({
    name: 'app',
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
            style: '',
            useModals: true,
        }
    },
    reducers: {
        animatedRefresh(state, action) {
            state.animationRefreshKey = Math.random();
        },
        setDefaultCompany(state, action: PayloadAction<TCompany>) {
            console.log('setDefaultCompany');
            console.log(action.payload);
            console.log('setDefaultCompany');
            state.defaultCompany = action.payload;
        },
        removeDefaultCompany(state,action) {
            console.log('removeDefaultCompany');
            state.defaultCompany = {
                id: '',
                name: '',
                email: ''
            } 
        },
        enableLoading(state, action) {
            state.isLoading = true;
        },
        disableLoading(state, action) {
            state.isLoading = false;
        },
        enableModals(state, action) {
            state.settings.useModals = true;
        },
        disableModals(state, action) {
            state.settings.useModals = false;
        }
    }
})

export const {  
    animatedRefresh,
    setDefaultCompany,
    removeDefaultCompany,
    enableLoading,
    disableLoading,
    enableModals,
    disableModals
} = appSlice.actions;

export default appSlice.reducer;