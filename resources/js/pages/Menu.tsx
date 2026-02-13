import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "./admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"

import "../../sass/menu.scss"
import CreateMenu from "@/components/menu/CreateMenu";
import MenuAPI from "@/api/MenuAPI";
import { TMenu } from "@/types/Menu";

interface IProps {};
interface IState {
    isCreateMenuModalOpened: boolean,
    menuItems: Array<TMenu>;
};
class Menu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateMenuModalOpened: false,
            menuItems: []
        }
    }

    componentDidMount(): void {
        this.fetchMenuItems();
    }

    render(): ReactNode {
        return (
            <div className="admin-nav-c">
                <Navigation />

                <div className="main-content">
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Menu</h4>
                            <h3>{'Exchange <- ->'}</h3>
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="w-12 d-flex justify-content-start">

                            {/* MAIN CONTAINER ITEMS */}
                            <div className="rounded-dotted-div backgr m-2">
                                <span>Shrimps plate 2lb</span> 
                            </div>

                            {this.state.menuItems.map((item: TMenu, index) => {
                                let picPath: String = item.picture as String;
                                if(picPath)
                                    return <div className="rounded-dotted-div m-2" style={{backgroundImage: `url(${'/storage/' + picPath.replaceAll('\'', '')})`}} data-path={`${picPath}`}>
                                        <span>{item.name}</span> 
                                    </div>
                                else return <div className="rounded-dotted-div backgr m-2">
                                    <span>{item.name}</span> 
                                </div>
                            })}

                            {/* TEMPLATE CONTAINER ITEM */}
                            <div className="rounded-dotted-div m-2 add-template">
                                
                                <div className="temp-overlay">
                                    <CiCirclePlus onClick={this.openCreateModal}/>
                                </div>
                                    <div className="name-demo"></div>
                            </div>

                        </div>
                        
                    </div>
                </div>
                <CreateMenu isOpen={this.state.isCreateMenuModalOpened} type="modal" closeCreateMenuModal={this.closeCreateMenuModal} />
            </div>

        )
    }

    fetchMenuItems = async() => {
        const items = await MenuAPI.getItems();
        // debugger;
        if(items) {
            this.setState({ menuItems: items });
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateMenuModalOpened: true });
    }

    closeCreateMenuModal = () => {
        this.setState({ isCreateMenuModalOpened: false });
    }
}


export default Menu;