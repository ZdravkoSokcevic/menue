import React, { Component, ReactNode, useState } from "react";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    Children: ReactNode;
    rest: any
}

// export const PrivateRoute = ( props: PrivateRouteProps ) => {
//     const [auth, setAuth] = useState(true);
//     const Children: ReactNode = props.children;
//     return auth ? <Children /> : <Navigate to={"/login"} />;
// }

// export function ProtectedRoute({ Children, ...rest} : PrivateRouteProps) {
//     let user = 
//         return usePage().props.auth.user ? <Children {...rest} /> : <Navigate to={"/admin/login"} />;
//         // return (
//         //     <Route {...this.props.rest} render= {(props) => (
//         //         usePage().props.auth.user ?
//         //         <Element {...rest} /> : 
//         //         <Navigate to={"/admin/login"} />
//         //     )} />
//         // )
//     // }
// }

import { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Your custom auth hook

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <div>Loading...</div>; // Show a spinner while checking auth status
  }

  if (!user) {
    // Redirect to login, but save the current location to redirect back after login
    return <Link to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;