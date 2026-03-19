import React from "react";
import Navigation from "./admin/Navigation";
import TUser from "@/types/TUser";
import { useEffect } from "react";

interface IProps {};
interface IState {
    user: TUser | null;
};

class Admin extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        
    }

    render() {
        return (
            <div className="admin-page page">
                {/* <Navigation /> */}

                <div className="main-content">
                    <p>Admin page</p>
                </div>
            </div>
        )
    }
}

export default Admin;