import React from "react";
import Navigation from "../admin/Navigation";
import TUser from "@/types/TUser";

interface IProps {};
interface IState {
    user: TUser | null;
};

class Menu extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        
    }

    render() {
        return (
            <div className="admin-nav-c">
                <Navigation />

                <div className="main-content">
                    <p>Menu page</p>
                </div>
            </div>
        )
    }
}

export default Menu;