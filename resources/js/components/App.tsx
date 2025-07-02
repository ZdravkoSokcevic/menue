import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import React from 'react';
// @ts-ignore
import { Container, createRoot } from 'react-dom/client';

import Home from "../pages/Home";
import About from "../pages/About";
import { PrivateRoute } from './PrivateRoute';
import { ToastContainer } from 'react-toastify';
import Login from '@/pages/admin/Login';



const App: React.FC = () => {


    return (
        <>
        <BrowserRouter>
            <React.Fragment>
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
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path='/about' element={ <About nesto="to nesto" /> }></Route>
                <Route path="/settings" element= {
                    <PrivateRoute Children={<About nesto="nesto" />}></PrivateRoute>
                }/>

                <Route path="/login" element= {
                    <Login />
                }/>
                {/* <PrivateRoute path="/about" element={<About />} /> */}
                {/* <Route path="/administrator" element={} */}
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </>
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
