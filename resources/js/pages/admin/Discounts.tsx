import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete, MdOutlineTranslate } from "react-icons/md";

import "../../../sass/list-card.scss"
import "../../../sass/discounts.scss"
import CreateMenu from "@/components/menu/CreateMenu";
import MenuAPI from "@/api/MenuAPI";
import { TMenu } from "@/types/Menu";
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import MenuTranslation from "@/components/menu/MenuTranslation";
import Translations from "@/components/Translations";
import CreateDiscount from "@/components/ciscount/CreateDiscount";
import { IDiscount, TDiscounts } from "@/types/Discount";
import DiscountsAPI from "@/api/DiscountsAPI";

interface IProps {};
interface IState {
    isCreateDiscountModalOpened: boolean;
    isViewDiscountModalOpened: boolean;
    isEditDiscountModalOpened: boolean;
    isDeleteModalOpened: boolean;
    isTranslationsModalOpened: boolean;
    discountItems: TDiscounts;
    currentItem: IDiscount;
};
class Discounts extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateDiscountModalOpened: false,
            isViewDiscountModalOpened: false,
            isEditDiscountModalOpened: false,
            isDeleteModalOpened: false,
            isTranslationsModalOpened: false,
            discountItems: [],
            currentItem: {} as IDiscount
        }
    }

    componentDidMount(): void {
        this.fetchMenuItems();
    }

    render(): ReactNode {
        return (
            <div className="discount-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5 container">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Discounts</h4>
                            {/* <h3>{'Exchange <- ->'}</h3> */}
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container row">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.discountItems.map((item: IDiscount, index) => {
                                let picPath: String = item.menu?.picture as String;
                                const picFullPath = (picPath) ? "url('/storage/" + picPath.replaceAll('\'', '') + "')" : '';
                                return <div 
                                            className={'m-2 placeholder-4-3 col-3 rounded-dotted-div discount-item-container position-relative item-container position-relative overflow-hidden'}
                                            style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                            key={item.id}
                                        >
                                            {/* Dark gradient */}
                                            <div className="card-overlay"></div>
                                            {/* INDICATES WEATHER ITEM IS NEW */}
                                            {/* Ribbon */}
                                            {item.new && (
                                                <div className="ribbon ribbon-primary new">
                                                    NEW
                                                </div>
                                            )}
                                            {/* <span className="name">{item.menu?.name}</span>  */}

                                            {/* Hover actions */}
                                            <div className="item-info allergen-info">
                                                <div className="card-actions-wrapper">
                                                    <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)} className="text-primary"/>
                                                    <IoEye onClick={() => this.onViewClicked(item)} className="text-info"/>
                                                    <HiMiniPencilSquare onClick={() => this.onEditClicked(item)} className="text-warning"/>
                                                    <MdDelete onClick={() => this.onDeleteClicked(item)} className="text-danger" />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="card-title-wrapper">
                                                <span className="card-title">
                                                    {item.menu?.name}
                                                </span>
                                            </div>

                                            {/* <div className="item-info allergen-info">
                                                <span className="name name-hover">{item.menu?.name}</span> 
                                                <div className="d-flex flex-direction-column card-actions">
                                                    <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)}/>
                                                    <IoEye onClick={() => this.onViewClicked(item)}/>
                                                    <HiMiniPencilSquare onClick={() => this.onEditClicked(item)}/>
                                                    <MdDelete onClick={() => this.onDeleteClicked(item)}/>
                                                </div>
                                            </div> */}
                                            
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
                <CreateDiscount 
                    isOpen={this.state.isCreateDiscountModalOpened} 
                    type="modal" 
                    closeCreateDiscountModal={this.closeCreateDiscountModal}
                    addNewDiscountItem={this.addNewDiscountItem} 
                />
                <View 
                    isOpen={this.state.isViewDiscountModalOpened} 
                    type="discount" 
                    closeModal={this.closeViewDiscountModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
                <Edit 
                    isOpen={this.state.isEditDiscountModalOpened} 
                    type="discount" 
                    closeModal={this.closeEditDiscountModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete discount?`} 
                    closeModal={this.closeDeleteDiscountModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
                <Translations 
                    type="discount"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closeMenuTranslationsModal}
                    editTranslationItem={this.editTranslationItem}

                />
            </div>

        )
    }

    fetchMenuItems = async() => {
        const items = await DiscountsAPI.getItems();
        // debugger;
        if(items) {
            this.setState({ discountItems: items });
        }
    }

    addNewDiscountItem = (newItem: IDiscount) => {
        this.setState({ discountItems: [...this.state.discountItems, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IDiscount) => {
        const items = this.state.discountItems;
        const updatedItems = items.map((item: IDiscount) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ discountItems: updatedItems });
    }

    onViewClicked = (item: IDiscount) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: IDiscount) => {
        this.setState({ currentItem: item });
        this.openEditDiscountModal();
    }

    onDeleteClicked = (item: IDiscount) => {
        this.setState({ currentItem: item });
        this.openDeleteDiscountModal();
    }

    onTranslationClicked = (item: IDiscount) => {
        this.setState({ currentItem: item });
        this.openMenuTranslationsModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await DiscountsAPI.deleteDiscount(currentItem.id);
            if(res && res.success) {
                const newItems: TDiscounts = this.state.discountItems.filter((item: IDiscount, index: number) => item.id != currentItem.id);
                this.setState({ discountItems: newItems });
                this.closeDeleteDiscountModal();
            }else {
                alert('Cannot delete discount!');
            }
        }else {
            alert('Cannot delete discount');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateDiscountModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewDiscountModalOpened: true });
    }
    
    openEditDiscountModal = () => {
        this.setState({ isEditDiscountModalOpened: true });
    }

    openDeleteDiscountModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    openMenuTranslationsModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    closeCreateDiscountModal = () => {
        this.setState({ isCreateDiscountModalOpened: false });
    }

    closeViewDiscountModal = () => {
        this.setState({ currentItem: {} as IDiscount });
        this.setState({ isViewDiscountModalOpened: false });
    }

    closeEditDiscountModal = () => {
        this.setState({ currentItem: {} as IDiscount });
        this.setState({ isEditDiscountModalOpened: false })
    }

    closeDeleteDiscountModal = () => {
        this.setState({ currentItem: {} as IDiscount });
        this.setState({ isDeleteModalOpened: false })
    }

    closeMenuTranslationsModal = () => {
        this.setState({ currentItem: {} as IDiscount });
        this.setState({ isTranslationsModalOpened: false });
    }

    editTranslationItem = (item: TMenu) => {
        let stat = this.state.discountItems;
        let newState = stat.map((discount: IDiscount) => {
            if(item.id == discount.id) {
                discount.translations = item.translations;
            }
            return discount;
        })

        this.setState({ discountItems: newState });
    }
}


export default Discounts;