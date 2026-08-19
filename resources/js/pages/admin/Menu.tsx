import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete, MdOutlineTranslate } from "react-icons/md";

import "../../../sass/list-card.scss"
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
import { showToast } from "@/helpers/Toast";

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
                                    className={'m-2 placeholder-4-3 col-3 rounded-dotted-div menu-item-container position-relative item-container' +
                                        (!item.portions?.length ? ' border-danger' : '')}
                                    style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                    key={index}
                                >
                                    {/* Dark gradient */}
                                    <div className="card-overlay"></div>
                                    {/* INDICATES WEATHER ITEM IS NEW */}
                                    {item.new && <div className="ribbon ribbon-primary new">NEW</div>}
                                    
                                    <div className="item-info menu-info">
                                        <div className="card-actions">
                                            {item.description && (
                                                <p className="hover-description text-truncate" style={{maxWidth: '250px'}}>{item.description}</p>
                                            )}
                                            {!item.portions?.length && <span className="badge bg-danger">
                                                No price
                                            </span>}
                                            <div className="card-actions-wrapper">
                                                <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)} className="text-primary"/>
                                                <IoEye onClick={() => this.onViewClicked(item)} className="text-info"/>
                                                <HiMiniPencilSquare onClick={() => this.onEditClicked(item)} className="text-warning"/>
                                                <MdDelete onClick={() => this.onDeleteClicked(item)} className="text-danger"/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="card-title-wrapper">
                                        <span className="card-title">
                                            {item.name}
                                        </span>
                                    </div>
                                </div>
                            })}

                            {/* TEMPLATE CONTAINER ITEM */}
                            <div 
                                className="rounded-dotted-div m-2 col-3 add-template placeholder-4-3 item-container"
                                onClick={this.openCreateModal} // Making the entire container clickable is much better UX
                            >
                                <div className="add-content-wrapper">
                                    <CiCirclePlus className="add-icon" />
                                </div>
                                
                                {/* Bottom placeholder matching the style of the food card titles */}
                                <div className="card-title-wrapper">
                                    <span className="card-title-placeholder"></span>
                                </div>
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
                <View 
                    isOpen={this.state.isViewMenuModalOpened} 
                    type="menu" 
                    closeModal={this.closeViewMenuModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
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
                    editTranslationItem={this.editTranslationItem}

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
                showToast.success('Menu deleted successfully');
            }else {
                showToast.error('Cannot delete menu');
            }
        }else {
            showToast.error('Cannot delete menu');
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

    editTranslationItem = (item: TMenu) => {
        let stat = this.state.menuItems;
        let newState = stat.map((menu: TMenu) => {
            if(item.id == menu.id) {
                menu.translations = item.translations;
            }
            return menu;
        })

        this.setState({ menuItems: newState });
    }
}


export default Menu;