import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";


import "../../../sass/menu.scss"
import CreateMenu from "@/components/menu/CreateMenu";
import MenuAPI from "@/api/MenuAPI";
import { TMenu } from "@/types/Menu";
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import MenuTranslation from "@/components/menu/MenuTranslation";
import Translations from "@/components/Translations";

interface IProps {};
interface IState {
    isCreateMenuModalOpened: boolean;
    isViewMenuModalOpened: boolean;
    isEditMenuMOdalOpened: boolean;
    isDeleteModalOpened: boolean;
    isTranslationsModalOpened: boolean;
    menuItems: Array<TMenu>;
    currentItem: TMenu;
};
class Menu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateMenuModalOpened: false,
            isViewMenuModalOpened: false,
            isEditMenuMOdalOpened: false,
            isDeleteModalOpened: false,
            isTranslationsModalOpened: false,
            menuItems: [],
            currentItem: {} as TMenu
        }
    }

    componentDidMount(): void {
        this.fetchMenuItems();
    }

    render(): ReactNode {
        return (
            <div className="menu-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5 container">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Menu</h4>
                            <h3>{'Exchange <- ->'}</h3>
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container row">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.menuItems.map((item: TMenu, index) => {
                                let picPath: String = item.picture as String;
                                const picFullPath = (picPath) ? "url('/storage/" + picPath.replaceAll('\'', '') + "')" : '';
                                return <div 
                                            className="m-2 placeholder-4-3 col-3 rounded-dotted-div" 
                                            style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                            key={Math.random()}
                                        >
                                    <span className="name">{item.name}</span> 
                                    <div className="menu-info">
                                        <span>{item.name}</span> 
                                        <span>{item.description}</span>
                                        <div className="d-flex flex-direction-column card-actions">
                                            <IoEye onClick={() => this.onTranslationClicked(item)}/>
                                            <IoEye onClick={() => this.onViewClicked(item)}/>
                                            <HiMiniPencilSquare onClick={() => this.onEditClicked(item)}/>
                                            <MdDelete onClick={() => this.onDeleteClicked(item)}/>
                                        </div>
                                    </div>
                                </div>
                            })}

                            {/* TEMPLATE CONTAINER ITEM */}
                            <div className="rounded-dotted-div m-2 col-3 add-template placeholder-4-3">
                                
                                <div className="temp-overlay">
                                    <CiCirclePlus onClick={this.openCreateModal}/>
                                </div>
                                    <div className="name-demo"></div>
                            </div>

                        </div>
                        
                    </div>
                {/* </div> */}
                <CreateMenu 
                    isOpen={this.state.isCreateMenuModalOpened} 
                    type="modal" 
                    closeCreateMenuModal={this.closeCreateMenuModal}
                    addNewMenuItem={this.addNewMenuItem} 
                />
                <View isOpen={this.state.isViewMenuModalOpened} type="menu" closeModal={this.closeViewMenuModal} currentItem={this.state.currentItem as TComponentProps} />
                <Edit 
                    isOpen={this.state.isEditMenuMOdalOpened} 
                    type="menu" 
                    closeModal={this.closeEditMenuModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete menu <b>${this.state.currentItem.name}</b>?`} 
                    closeModal={this.closeDeleteMenuModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
                <Translations 
                    type="menu"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closeMenuTranslationsModal}

                />
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

    addNewMenuItem = (newItem: TMenu) => {
        this.setState({ menuItems: [...this.state.menuItems, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: TMenu) => {
        const items = this.state.menuItems;
        const updatedItems = items.map((item: TMenu) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ menuItems: updatedItems });
    }

    onViewClicked = (item: TMenu) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: TMenu) => {
        this.setState({ currentItem: item });
        this.openEditMenuModal();
    }

    onDeleteClicked = (item: TMenu) => {
        this.setState({ currentItem: item });
        this.openDeleteMenuModal();
    }

    onTranslationClicked = (item: TMenu) => {
        this.setState({ currentItem: item });
        this.openMenuTranslationsModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await MenuAPI.deleteMenu(currentItem.id);
            if(res && res.success) {
                const newItems: Array<TMenu> = this.state.menuItems.filter((item: TMenu, index: number) => item.id != currentItem.id);
                this.setState({ menuItems: newItems });
                this.closeDeleteMenuModal();
            }else {
                alert('Cannot delete menu!');
            }
        }else {
            alert('Cannot delete menu');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateMenuModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewMenuModalOpened: true });
    }
    
    openEditMenuModal = () => {
        this.setState({ isEditMenuMOdalOpened: true });
    }

    openDeleteMenuModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    openMenuTranslationsModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    closeCreateMenuModal = () => {
        this.setState({ isCreateMenuModalOpened: false });
    }

    closeViewMenuModal = () => {
        this.setState({ currentItem: {} as TMenu });
        this.setState({ isViewMenuModalOpened: false });
    }

    closeEditMenuModal = () => {
        this.setState({ currentItem: {} as TMenu });
        this.setState({ isEditMenuMOdalOpened: false })
    }

    closeDeleteMenuModal = () => {
        this.setState({ currentItem: {} as TMenu });
        this.setState({ isDeleteModalOpened: false })
    }

    closeMenuTranslationsModal = () => {
        this.setState({ currentItem: {} as TMenu });
        this.setState({ isTranslationsModalOpened: false });
    }
}


export default Menu;