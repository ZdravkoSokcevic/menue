import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { userSlice } from './userSlice';
import { appSlice } from './appSlice';
export const Store = configureStore({
    reducer: {
        user: userSlice.reducer,
        app: appSlice.reducer
    },
});

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
