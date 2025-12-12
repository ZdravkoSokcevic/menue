import React from "react";
import Navigation from "./admin/Navigation";

interface IProps {};
interface IState {};

class Admin extends React.Component<IProps, IState>
{
    render() {
        return (
            <div>
                <Navigation />
                <p>Admin page</p>
            </div>
        )
    }
}

export default Admin;