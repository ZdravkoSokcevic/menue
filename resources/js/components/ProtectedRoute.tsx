import React, { Component, ReactNode, useEffect, useState } from "react";
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { appSlice, setDefaultCompany } from "@/reducers/appSlice";
import { Store } from "@/reducers/Store";

import TUser from "@/types/TUser";

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
import Storage from "@/helpers/Storage";
import { TCompany } from "@/types/TCompanies";

interface ProtectedRouteProps {
  children?: ReactElement;
  path?: string;
}



const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [user, setUser] = React.useState(null as null | TUser);
  const [company, setCompany] = React.useState(null as null | TCompany)
  const [isDataFetched, setIsDataFetched] = React.useState(false);

  const fetchAuth = async() => {
    let user = Store.getState().user.user;
    setUser(user);
  };

  const fetchSelectedCompany = async() => {
    return new Promise((resolve, reject) => resolve(Store.getState().app.defaultCompany));
  }
  // bit complicated structure
  // but is necessary to finish all loading
  // before we turn off loader
  // Bcs of preventing additional renders
  useEffect(() => {
    setIsDataFetched(false);
    let fAuth = fetchAuth();
    let fCompany = fetchSelectedCompany();
    Promise.all([ fAuth, fCompany])
      .then(() => {
        setIsDataFetched(true);
      });
  }, [1]);

  // Here is solved problem of double rendering this page
  // That's why isDataFetched is included bcs
  // Because conditions works even before data is fetched from localStorage
  if (user && company && company.id != '' && location.pathname == '/companies' && isDataFetched) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }


  if ((user == null || (user && user.id == '') && location.pathname != '/login') && isDataFetched) {
      // Redirect to login, but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // debugger;
  return children;
};

export default ProtectedRoute;