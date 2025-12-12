import React, { Component, ReactNode, useState } from "react";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: Component;
}

export const PrivateRoute = ( props: PrivateRouteProps ) => {
    const [auth, setAuth] = useState(true);
    const Children: ReactNode = props.children;
    return auth ? <Children /> : <Navigate to={"/login"} />;
}

// export class PrivateRoute extends React.Component
// {
//     constructor(children, rest) {
//         super(children);
//     }
//     render = () => {
//         return usePage().props.auth.user ? <Children {...rest} /> : <Navigate to={"/admin/login"} />;
//         // return (
//         //     <Route {...this.props.rest} render= {(props) => (
//         //         usePage().props.auth.user ?
//         //         <Element {...rest} /> : 
//         //         <Navigate to={"/admin/login"} />
//         //     )} />
//         // )
//     }
// }