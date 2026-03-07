import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userSlice } from './userSlice';
import { appSlice } from './appSlice';
import persistStore from 'redux-persist/es/persistStore';
// export const Store = configureStore({
//     reducer: {
//         user: userSlice.reducer,
//         app: appSlice.reducer
//     },
// });

const userPersistConfig = {
  key: 'user',
  storage: storage,
  // blacklist: ['auth']
}

const appPersistConfig = {
  key: 'app',
  storage: storage,
  // blacklist: ['auth'],
  // whitelist: [ 'setDefaultCompany', 'removeDefaultCompany' ]
}

// const Store = combineReducers({
//     user: persistReducer(userPersistConfig, userSlice.reducer),
//     app: persistReducer(appPersistConfig, appSlice.reducer)
// })

const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
const appReducer = persistReducer(appPersistConfig, appSlice.reducer);

export const Store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer
    },
    devTools: true,
});

// export const Store = combineReducers([userReducer, appReducer]);

export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
