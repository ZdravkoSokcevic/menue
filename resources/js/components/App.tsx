"use client"
import { BrowserRouter, Routes, Route, Link, useLocation, Location } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { Container, createRoot } from 'react-dom/client';

import Home from "../pages/Home";
import About from "../pages/About";
import ProtectedRoute, { PrivateRoute } from './ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import Login from '@/pages/admin/Login';
import Admin from '@/pages/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';



const App: React.FC = () => {

    let location = window.location;
    const [showNavigation, setShowNavigation] = useState(true);

    useEffect(() => {
        // // debugger;
        if(location.pathname == '/login')
            setShowNavigation(false);
    }, [1]);


    return (
        <BrowserRouter>
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
                    <ProtectedRoute children={<Admin />}> </ProtectedRoute>
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
        </BrowserRouter>
    )
}

export default App;

if (document.getElementById('root')) {
    const Index = createRoot(document.getElementById("root") as Container);

    Index.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
