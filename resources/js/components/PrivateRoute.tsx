import React, { useState } from "react";
import { Navigate } from "react-router-dom";

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

export const PrivateRoute = ({ Children, ...rest }: any) => {
    const [auth, setAuth] = useState(false);

    return auth ? <Children {...rest} /> : <Navigate to={"/admin/login"} />;
}