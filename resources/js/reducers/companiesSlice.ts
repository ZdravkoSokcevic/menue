import {TCompany, TCompaniesArr} from "@/types/TCompanies";
// import TComp from "@/types/TCompanies";

import {createSlice} from "@reduxjs/toolkit"
export const companies: Array<TCompany> = [];
export const companiesSlice = createSlice({
    name: '',
    initialState: {
        companies: [] as typeof companies
    },
    reducers: {
        addCompany: (state, action) => {

        },
        deleteCompany: (state, action) => {

        },
        // Replace all companies: (deletes old array, and makes new one)
        replaceCompanies: (state, action) => {
            state.companies = [];
            const allComp = [];
            action.payload.companies.forEach((company: TCompany)=> {
                allComp.push(company);
            });
        }
    }
})

export const {  
} = companiesSlice.actions;

export default companiesSlice.reducer;