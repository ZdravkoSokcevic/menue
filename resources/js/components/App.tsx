"use client"
import { BrowserRouter, Routes, Route, Link, useLocation, Location } from 'react-router-dom';
import { Provider, useStore } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { Container, createRoot } from 'react-dom/client';

import TUser from '../types/TUser';

import Home from "../pages/Home";
import About from "../pages/About";
import ProtectedRoute from './ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import Login from '@/pages/admin/Login';
import Admin from '@/pages/Admin';
import Menu from '@/pages/admin/Menu';
import Categories from '@/pages/admin/Categories';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Storage from '@/helpers/Storage';
import '../../sass/app.scss';
import Companies from '@/pages/admin/Companies';
import {Store, RootState, persistor } from "../reducers/Store";
import { DotLoader } from "react-spinners"
import ReactModal from 'react-modal';
import { setLoggedIn } from '@/reducers/userSlice';



const App: React.FC = () => {

    let location = window.location;
    const [showNavigation, setShowNavigation] = useState(true);
    const [user, setUser] = useState(null as null | TUser);

    useEffect(() => {
        // // debugger;
        getLoggedIn()
        loadStorageIntoStore();
        if(location.pathname == '/login' ||( user == null ))
            setShowNavigation(false);
    }, [1]);

    useEffect(() => {

    }, [(Store.getState() as RootState).app.animationRefreshKey]);

    // Potential issue, this isn't loading first
    const getLoggedIn = async() => {
        // let userStr = await Storage.get('user');
        const user = await Store.getState().user.user;
        setUser(user);
    }

    const loadStorageIntoStore = () => {
        // debugger;
    }


    return (
        <BrowserRouter>
            <div className={Store.getState().app.isLoading ? "app-container loading" : "app-container"}>
                {
                    showNavigation && <React.Fragment>
                        <nav>
                            <ul>
                                <li>
                                    <Link to={'/home'}>Home</Link>
                                </li>
                                <li>
                                    <Link to={'/about'}>About</Link>
                                </li>
                                {/* <li>Home</li> */}
                                {/* <li>About</li> */}
                            </ul>
                        </nav>
                    </React.Fragment>
                }
            
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={ <About nesto="to nesto" /> }></Route>
                    <Route path="/settings" element= {
                        <ProtectedRoute children={<About nesto="nesto" />}></ProtectedRoute>
                    }/>

                    {/* ADMIN COMPONENTS */}
                    <Route path="/admin" element = {
                        <ProtectedRoute children={<Admin />} />
                    } />

                    <Route path="/menu" element = {
                        <ProtectedRoute>
                            <Menu />
                        </ProtectedRoute>
                    } />

                    <Route path="/categories" element = {
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    } />

                    <Route path="/companies" element = {
                        <ProtectedRoute children={<Companies />} />
                    } />

                    {/*<Route path="/admin" element = {
                        <Admin />
                    } /> */}

                    <Route path="/login" element= {
                        <Login />
                    }/>
                    {/* <PrivateRoute path="/about" element={<About />} /> */}
                    {/* <Route path="/administrator" element={} */}
                </Routes>
                <ToastContainer />
                <DotLoader loading={Store.getState().app.isLoading} className="main-loader"/>
            </div>
        </BrowserRouter>
    )
}

export default App;

ReactModal.setAppElement('#root');

if (document.getElementById('root')) {
    const Index = createRoot(document.getElementById("root") as Container);

    Index.render(
        <React.StrictMode>
            <Provider store={ Store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </React.StrictMode>
    )
}
