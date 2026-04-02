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
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from 'react-router-dom';
import Navigation from '@/pages/admin/Navigation';
import Tables from '@/pages/admin/Tables';
import { disableLoading } from '@/reducers/appSlice';
import Allergens from '@/pages/admin/Allergens';
import Ingridients from '@/pages/admin/Ingridients';
import Extras from '@/pages/admin/Extras';
import Preferences from '@/pages/admin/Preferences';

const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100vw" },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};


const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};



const App: React.FC = () => {

    
    const location = useLocation();
    const [showNavigation, setShowNavigation] = useState(true);
    const [user, setUser] = useState(null as null | TUser);

    useEffect(() => {
        // Disable all loaders after 5s on initial load
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        }, 5000)
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
        <React.Fragment>
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
                <div className="admin-nav-c">
                <Navigation />

                <AnimatePresence mode="Wait">
                <motion.div 
                    key={location.pathname}
                    // initial="initial"
                    // animate="animate"
                    // exit="exit"
                    // variants={pageVariants}
                    // transition={pageTransition}
                    className={`motion-div ${location.pathname.replace('/', '')}`}

                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    transition={{ type: 'linear', duration: 0.3 }}
                >
            
                <Routes location={location}>
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

                    <Route path='/tables' element = {
                        <ProtectedRoute children={<Tables />} />
                    } />

                    <Route path='/allergens' element = {
                        <ProtectedRoute>
                            <Allergens />
                        </ProtectedRoute>
                    }/>

                    <Route path='/ingridients' element = {
                        <ProtectedRoute>
                            <Ingridients />
                        </ProtectedRoute>
                    } />

                    <Route path='/extras' element = {
                        <ProtectedRoute>
                            <Extras />
                        </ProtectedRoute>
                    } />

                    <Route path='/preferences' element = {
                        <ProtectedRoute>
                            <Preferences />
                        </ProtectedRoute>
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
                <Outlet />
                </motion.div>
                </AnimatePresence>
                </div>
                <ToastContainer />
                <DotLoader loading={Store.getState().app.isLoading} className="main-loader"/>
            </div>
        </React.Fragment>
    )
}

export default App;

ReactModal.setAppElement('#root');

if (document.getElementById('root')) {
    // in case that spinner won't turn off
    // Store.dispatch(disableLoading({}));
    const Index = createRoot(document.getElementById("root") as Container);

    Index.render(
        <React.StrictMode>
            <Provider store={ Store}>
                <PersistGate loading={null} persistor={persistor}>
                    {/* <motion.div transition={{duration: 1.4, ease: 'easeInOut'}}> */}
                    <BrowserRouter>
                    <App />
                    </BrowserRouter>
                    {/* </motion.div> */}
                </PersistGate>
            </Provider>
        </React.StrictMode>
    )
}
